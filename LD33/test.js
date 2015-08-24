(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }})("test",
{ "height":32,
 "layers":[
        {
         "compression":"zlib",
         "data":"eJztzbkRADAIwLD8+48cBqCmQbpz7TGArma0knbR\/0Q36RX9AQCgkw9IIgAy",
         "encoding":"base64",
         "height":32,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":32,
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
         "tilecount":9,
         "tileheight":32,
         "tiles":
            {
             "0":
                {
                 "image":"img\/wall_stone_grass_1.png"
                },
             "1":
                {
                 "image":"img\/wall_stone_grass_2.png"
                },
             "2":
                {
                 "image":"img\/wall_stone_grass_3.png"
                },
             "3":
                {
                 "image":"img\/wall_stone_grass_4.png"
                },
             "4":
                {
                 "image":"img\/wall_stone_grass_5.png"
                },
             "5":
                {
                 "image":"img\/wall_stone_grass_6.png"
                },
             "6":
                {
                 "image":"img\/wall_stone_grass_7.png"
                },
             "7":
                {
                 "image":"img\/wall_stone_grass_8.png"
                },
             "8":
                {
                 "image":"img\/wall_stone_grass_9.png"
                }
            },
         "tilewidth":32
        }],
 "tilewidth":32,
 "version":1,
 "width":32
});