#version 3.7;
global_settings {  assumed_gamma 1.0 }
#default{ finish{ ambient 0.1 diffuse 0.9 }} 
//--------------------------------------------------------------------------
#include "colors.inc"
#include "textures.inc"
#include "glass.inc"
#include "metals.inc"
#include "golds.inc"
#include "stones.inc"
#include "woods.inc"
#include "shapes.inc"
#include "shapes2.inc"
#include "functions.inc"
#include "math.inc"
#include "transforms.inc"
#include "skies.inc"

#declare RasterScale = 1.0;
#declare RasterHalfLine  = 0.035;  
#declare RasterHalfLineZ = 0.035; 
//-------------------------------------------------------------------------


 

#macro Raster(RScale, HLine) 
       pigment{ gradient x scale RScale
                color_map{[0.000   color rgbt<1,1,1,0>*0.6]
                          [0+HLine color rgbt<1,1,1,0>*0.6]
                          [0+HLine color rgbt<1,1,1,1>]
                          [1-HLine color rgbt<1,1,1,1>]
                          [1-HLine color rgbt<1,1,1,0>*0.6]
                          [1.000   color rgbt<1,1,1,0>*0.6]} }
 #end   
                            
                            
#declare Jump_Start  = 1;
#declare Jump_Height = 7;
#if (clock < Jump_Start )
 #declare Camera_Y = 12;
#else
 #declare Camera_Y = 3;
   + Jump_Height*
     1.5*(0.5+cos(0.5*pi*(clock-Jump_Start)));
#end 






#declare Camera_2 = camera { 

                         angle 80
                         location <3,Camera_Y,-20>
                         right x*image_width/image_height
                         look_at <-3,5,5>
                         rotate<0,-360*(clock+0.1),5>
}
                            

#declare ball=sphere{ <0,0,0>,0.25

        texture{ pigment{ radial frequency 2
                          color_map{ [0.0 color Red]
                                     [0.5 color Red]
                                     [0.5 color Black]
                                     [1.0 color Black]
                                   }
                        }   
                 finish { diffuse 0.9 phong 1 } 
                 
               }
      rotate<30,0,0>
      translate <2,0.25,-7>
      scale<2,2,2>
      }

                            
#declare figura=   box {
    <-1,0,-1>,< 0.5,3,0>
     texture {DMFWood4 
                  finish { diffuse 1.2
                           phong 1}
               
                translate<30,0,-5>
                
                }
  }
  
  
           
         
#declare num= sphere{ <0,0,0>, 0.25
        texture { 
                  finish { diffuse 0.9
                           phong 1}
                } 
        
      scale<0.8,0.8,0.5>
        }
        
        
                     
                            
#declare domino_two = union {
  object { figura }
  object{num translate <-0.25,2.2,-0.95>}
  object{num translate <-0.25,1,-0.95>}
  
}    


#declare domino_four = union {
  object { figura }
  object{num translate <-0.25,2.5,-0.95>}
  object{num translate <-0.65,1.6,-0.95>}
  object{num translate <-0.20,1,-0.95>}
  object{num translate <0.20,0.4,-0.95>} 
  
  
  
}



                            
camera{Camera_2}
// sun ---------------------------------------------------------------------
light_source{<1500,2500,-2500> color White}

// sky --------------------------------------------------------------- 
sky_sphere { S_Cloud2 }
          
//------------------------------------------------------------------------


//--------------------------------------------------------------------------
//---------------------------- objects in scene ----------------------------
//--------------------------------------------------------------------------
                 
  
            
                 
plane { <0,1,0>, 0
        texture { pigment{color White*1.1}
                  finish {ambient 0.45 diffuse 0.85}}
        texture { Raster(RasterScale,RasterHalfLine ) rotate<0,0,0> }
        texture { Raster(RasterScale,RasterHalfLineZ) rotate<0,90,0>}
        rotate<0,0,0>
      }
   


      
union{
object{ball
    translate <-9.5,0,2.8*clock>
 }    
 #for (i, 0,20, 1)  
    object{domino_four translate<-5,0,i*2 >}
    object{domino_two translate<-7-(i*1.2),0,(i*1.5)>}
    object{domino_two translate<-2.8+(i*1.2),0,(i*1.5)>}
 #end
 #for (i, 0,5, 1)
 
 #if(i=4)
      object{domino_two translate<-4,0,-1.8>}
      object{domino_two translate<-5.8,0,-1.8>}
 #else
 object{domino_four translate<-5,0,-9.5+(i*2)>}
 #end
 
 object{domino_four translate<-7,0,2+(i*2)>}
 object{domino_four translate<-2,0,2+(i*2)>}
 #end
 rotate<0,0,0>
 translate<5,0,0>
}
  


