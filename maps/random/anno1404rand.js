Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");
Engine.LoadLibrary("rmbiome");

TILE_CENTERED_HEIGHT_MAP = true;

setBiome("generic/temperate");

//
const tNorthTerrain = g_Terrains.mainTerrain;
const tWater = g_Terrains.water;
setBiome("generic/desert");
const tSouthTerrain = g_Terrains.mainTerrain;
setBiome("generic/mediterranean");
const tTradeTerrain = g_Terrains.mainTerrain;
setBiome("generic/temperate");
//

//Objects
const oGrass = g_Decoratives.grass;
const oGrassShort = g_Decoratives.grassShort;

const oPyramidBig = "gaia/ruins/pyramid_great";
const oPyramidSmall = "gaia/ruins/pyramid_minor";
const oStarterShip = "units/athen_ship_merchant";
const oTradeMarket = "structures/athen_market";
//


const heightSeaGround = -5;
const heightLand = 3;
const heightOffsetBump = 2;
const heightHill = 8;

var g_Map = new RandomMap(heightSeaGround, tWater);

const numPlayers = getNumPlayers();
const mapSize = g_Map.getSize();
const mapCenter = g_Map.getCenter();

var clPlayer = g_Map.createTileClass();
var clLand = g_Map.createTileClass();

var clNorth = g_Map.createTileClass();
var clSouth = g_Map.createTileClass();
var clTradePost = g_Map.createTileClass();

var clForest = g_Map.createTileClass();

var [playerIDs, playerPosition, playerAngle] = playerPlacementCircle(fractionToTiles(0.35));

//-----------------------------------
g_Map.log("Creating trade island");
createArea(
	new ChainPlacer(6,6,25,0.07, mapCenter),
	[
		new TerrainPainter(tTradeTerrain),
		new SmoothElevationPainter(ELEVATION_SET, heightLand, 6),
		new TileClassPainter(clLand),
		new TileClassPainter(clTradePost)
	]);

g_Map.log("Creating biomes");
createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(0.0, 2.0*mapCenter.y - 1)),[new TileClassPainter(clNorth)], avoidClasses(clTradePost, 1));
createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(mapCenter.x, 2.0*mapCenter.y - 1)),[new TileClassPainter(clNorth)], avoidClasses(clTradePost, 1));
createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(2.0*mapCenter.x-1, 2.0*mapCenter.y - 1)),[new TileClassPainter(clNorth)], avoidClasses(clTradePost, 1));

createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(0.0, 0.0)),[new TileClassPainter(clSouth)], avoidClasses(clTradePost, 1));
createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(mapCenter.x, 0.0)),[new TileClassPainter(clSouth)], avoidClasses(clTradePost, 1));
createArea(new ClumpPlacer(diskArea(mapCenter.x), 1.0, 0.1, Infinity, new Vector2D(2.0*mapCenter.x-1, 0.0)),[new TileClassPainter(clSouth)], avoidClasses(clTradePost, 1));

//-----------------------------------	
g_Map.log("Creating northern islands");
createAreas(
	new ChainPlacer(7,13,75,0.07),
	[
		new TerrainPainter(tNorthTerrain),
		new SmoothElevationPainter(ELEVATION_SET, heightLand, 6),
		new TileClassPainter(clLand)
	],
	avoidClasses(clLand, scaleByMapSize(3, 6), clSouth, 8, clTradePost, 3),
	scaleByMapSize(4, 6));
	
g_Map.log("Creating southern islands");
createAreas(
	new ChainPlacer(7,13,75,0.07),
	[
		new TerrainPainter(tSouthTerrain),
		new SmoothElevationPainter(ELEVATION_SET, heightLand, 6),
		new TileClassPainter(clLand)
	],
	avoidClasses(clLand, scaleByMapSize(3, 6), clNorth, 8, clTradePost, 3),
	scaleByMapSize(4, 6));
//-----------------------------------
	
	
g_Map.log("Creating Northern Objects");
createStragglerTrees(
	[g_Gaia.tree1,g_Gaia.tree2,g_Gaia.tree3,g_Gaia.tree4,g_Gaia.tree5],
	[avoidClasses(clSouth, 1, clTradePost, 1), stayClasses(clLand, 12)],
	clForest,
	rBiomeTreeCount(2)[1]);

var group = new SimpleGroup([new SimpleObject(g_Gaia.mainHuntableAnimal, 3,6, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clSouth, 4, clTradePost, 1), stayClasses(clLand, 1, clNorth, 4)], 2 * scaleByMapSize(4, 6), 50, false);
group = new SimpleGroup([new SimpleObject(g_Gaia.secondaryHuntableAnimal, 3,5, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clSouth, 4, clTradePost, 1), stayClasses(clLand, 1, clNorth, 4)], 2 * scaleByMapSize(4, 6), 50, false);
group = new SimpleGroup([new SimpleObject(g_Gaia.fish, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clLand, 4, clSouth, 8), stayClasses()], scaleByMapSize(4, 8), 100, false);

	
group = new SimpleGroup([new SimpleObject(g_Gaia.stoneLarge, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clSouth, 8, clTradePost, 1, clForest, 0), stayClasses(clLand, 6, clNorth, 4)], scaleByMapSize(1, 4), 100, false);
	
group = new SimpleGroup([new SimpleObject(g_Gaia.stoneSmall, 1, 3, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clSouth, 8, clTradePost, 1, clForest, 0), stayClasses(clLand, 6, clNorth, 4)], scaleByMapSize(1, 3), 100, false);


	
g_Map.log("Creating Southern Objects");
setBiome("generic/desert");
createStragglerTrees(
	[g_Gaia.tree1,g_Gaia.tree2,g_Gaia.tree3,g_Gaia.tree4,g_Gaia.tree5],
	[avoidClasses(clNorth, 1, clTradePost, 1), stayClasses(clLand, 16)],
	clForest,
	rBiomeTreeCount(0.1)[1]);

group = new SimpleGroup([new SimpleObject(g_Gaia.mainHuntableAnimal, 3,6, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 4, clTradePost, 0), stayClasses(clLand, 1, clSouth, 4)], scaleByMapSize(4, 6), 50, false);
group = new SimpleGroup([new SimpleObject(g_Gaia.secondaryHuntableAnimal, 3,6, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 4, clTradePost, 0), stayClasses(clLand, 1, clSouth, 4)], scaleByMapSize(4, 6), 50, false);
group = new SimpleGroup([new SimpleObject(g_Gaia.fish, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clLand, 4, clNorth, 8), stayClasses()], scaleByMapSize(4, 8), 100, false);


group = new SimpleGroup([new SimpleObject(g_Gaia.stoneLarge, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 8, clTradePost, 1, clForest, 0), stayClasses(clLand, 8, clSouth, 4)], 0.5 * scaleByMapSize(1, 4), 100, false);
	
group = new SimpleGroup([new SimpleObject(g_Gaia.metalLarge, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 8, clTradePost, 1, clForest, 0), stayClasses(clLand, 8, clSouth, 4)], scaleByMapSize(1, 4), 100, false);

group = new SimpleGroup([new SimpleObject(g_Gaia.metalSmall, 1, 3, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 8, clTradePost, 1, clForest, 0), stayClasses(clLand, 8, clSouth, 4)], scaleByMapSize(1, 3), 100, false);
	
	
group = new SimpleGroup([new SimpleObject(oPyramidBig, 1, 1, 0,4)],true);
createObjectGroups(group, 0, [avoidClasses(clNorth, 16, clTradePost, 2, clForest, 8), stayClasses(clLand, 16, clSouth, 16)], 1, 250, false);
	
setBiome("generic/temperate");


group = new SimpleGroup([new SimpleObject(oTradeMarket, 1, 1, 0,4)],true, clTradePost, mapCenter);
createObjectGroup(group, 0);

	
placePlayersNomad(clPlayer, [stayClasses(clLand, 4, clTradePost, 2), avoidClasses(clSouth, 2)]);

for(let i = 0; i < numPlayers; i++){
	group = new SimpleGroup([new SimpleObject(oStarterShip, 1, 1, 0,4)],true);
	createObjectGroups(group, playerIDs[i], [avoidClasses(clSouth, 4, clLand, 4), stayClasses()], 1, 500, false);
}


setSkySet(pickRandom(["cirrus", "cumulus", "sunny"]));
setSunRotation(randomAngle());
setSunElevation(randFloat(1/5, 1/3) * Math.PI);
setWaterWaviness(2);

g_Map.ExportMap();
