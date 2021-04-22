var dog,sadDog,happyDog;
var addfood,feedPet,mlkImg;
var foodObj,foodstock,foods,fedTime,lastFed;
var database;
function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
  
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  
  foodstock=database.ref('food');
  foodstock.on("value",readstock);
  
  foodObj = new Food();
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addfood=createButton("ADD FOOD");
  addfood.position(700,100);
  addfood.mousePressed(addFoods);

  feedPet=createButton("FEED ROCKY");
  feedPet.position(900,100);
  feedPet.mousePressed(feedDog);


}

function draw() {
  background(46,139,87);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readstock(data){
  foods=data.val();
  foodObj.updateFood(foods);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  var food_stock_val = foodObj.getFood();
  if(food_stock_val <= 0){
      foodObj.updateFood(food_stock_val *0);
  }else{
      foodObj.updateFood(food_stock_val -1);
      foodObj.deductFood();
  }
  
  database.ref('/').update({
    food:foodObj.getFood(),
    lastfed:hour()
  })
}


//function to add food in stock
function addFoods(){
  foods++;
  database.ref('/').update({
    food:foods
  })
}
