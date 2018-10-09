function ResourceGenerator() {}

ResourceGenerator.prototype.Schema =
	"<a:help>Controls the resource trickle ability of the unit.</a:help>" +
	"<element name='Rates' a:help='Trickle Rates'>" +
		Resources.BuildSchema("decimal") +
	"</element>" +
	"<optional><element name='MaxCapacity' a:help='Maximum Capacity'>" +
		Resources.BuildSchema("nonNegativeDecimal") +
	"</element></optional>" +
	"<optional><element name='UnitsToFunction' a:help='Number of units inside to function properly'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element></optional>" +
	"<element name='Interval' a:help='Number of miliseconds must pass for the player to gain the next trickle.'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>";
	
ResourceGenerator.prototype.Init = function()
{
	this.ComputeRates();

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
 	cmpTimer.SetInterval(this.entity, IID_ResourceGenerator, "Trickle", this.GetTimer(), this.GetTimer(), undefined);
};

ResourceGenerator.prototype.GetTimer = function()
{
	return +this.template.Interval;
};

ResourceGenerator.prototype.GetRates = function()
{
	return this.rates;
};

ResourceGenerator.prototype.ComputeRates = function()
{
	this.rates = {};
	
	for (let resource in this.template.Rates){
		this.rates[resource] = ApplyValueModificationsToEntity("ResourceGenerator/Rates/"+resource, +this.template.Rates[resource], this.entity);		
	}
};

ResourceGenerator.prototype.Trickle = function(data, lateness)
{
	// The player entity may also have a ResourceTrickle component
	let cmpPlayer = QueryOwnerInterface(this.entity) || Engine.QueryInterface(this.entity, IID_Player);
	if (!cmpPlayer)
		return;

	//Check if units are inside
	if(this.template.UnitsToFunction){
		let cmpGarrison = Engine.QueryInterface(this.entity, IID_GarrisonHolder);
		if(!cmpGarrison)
			return;
		
		var unitsInside = cmpGarrison.GetGarrisonedEntitiesCount();
		if(unitsInside<this.template.UnitsToFunction){
			return;
		}
	}
	
	//Compute resource consumation
	var resAmount = cmpPlayer.GetResourceCounts();
	var totalCosts = {};
	for (let resource in this.template.Rates){
		if(this.template.Rates[resource] < 0 && resAmount[resource]<-this.template.Rates[resource])
			return;
	}
	
	if(this.template.MaxCapacity){
		for(let resource in this.template.MaxCapacity){
			if(this.template.MaxCapacity[resource] <= resAmount[resource])
				return;
		}
	}
	
	cmpPlayer.AddResources(this.rates);
};

ResourceGenerator.prototype.OnValueModification = function(msg)
{
	if (msg.component != "ResourceGenerator")
		return;

	this.ComputeRates();
};

Engine.RegisterComponentType(IID_ResourceGenerator, "ResourceGenerator", ResourceGenerator);
