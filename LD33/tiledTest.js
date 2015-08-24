(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }})("tiledTest",
{ "height":100,
 "layers":[
        {
         "compression":"zlib",
         "data":"eJzt1KsKACAUREGLz\/\/\/YG8xGwRBnIHTN21KAAAAAAAAAAAAAAAAAAAAAOzkqBxWr68GftSifti4vhr4kb8CXuGvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWCZFXQJT",
         "encoding":"base64",
         "height":100,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":300,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "properties":
    {

    },
 "renderorder":"left-down",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "margin":0,
         "name":"LD33",
         "properties":
            {

            },
         "spacing":0,
         "terrains":[
                {
                 "name":"New Terrain",
                 "tile":-1
                }],
         "tilecount":13,
         "tileheight":32,
         "tiles":
            {
             "0":
                {
                 "image":"img\/spikes_down.png"
                },
             "1":
                {
                 "image":"img\/spikes_left.png"
                },
             "10":
                {
                 "image":"img\/wall_stone_grass_7.png"
                },
             "11":
                {
                 "image":"img\/wall_stone_grass_8.png"
                },
             "12":
                {
                 "image":"img\/wall_stone_grass_9.png"
                },
             "2":
                {
                 "image":"img\/spikes_right.png"
                },
             "3":
                {
                 "image":"img\/spikes_up.png"
                },
             "4":
                {
                 "image":"img\/wall_stone_grass_1.png"
                },
             "5":
                {
                 "image":"img\/wall_stone_grass_2.png"
                },
             "6":
                {
                 "image":"img\/wall_stone_grass_3.png"
                },
             "7":
                {
                 "image":"img\/wall_stone_grass_4.png"
                },
             "8":
                {
                 "image":"img\/wall_stone_grass_5.png"
                },
             "9":
                {
                 "image":"img\/wall_stone_grass_6.png"
                }
            },
         "tilewidth":32
        }],
 "tilewidth":32,
 "version":1,
 "width":300
});