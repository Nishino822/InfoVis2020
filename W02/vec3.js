
class Vec3
{
  constructor(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  
  }
    min(){
     function compareFunc(a, b) {
     return b - a;
}
 
    var num = [x,y,z];
    num.sort(compareFunc);
    return num[2] ;

     
    }

    max(){
      function compareFunc(a, b) {
  return b - a;
}
 
var num = [x,y,z];
num.sort(compareFunc);
     
      return num[1];
    }
   
    mid(){
      function compareFunc(a, b) {
  return b - a;
}
 
var num = [x,y,z];
num.sort(compareFunc);
      return num[0];
}

}
