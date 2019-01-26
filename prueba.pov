#version 3.7;
global_settings {  assumed_gamma 1.0 }
#version 3.7;
global_settings{ assumed_gamma 1.0 }
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
                            
                            
#declare Jump_Start  = 0.5;
#declare Jump_Height = 7;
#if (clock < Jump_Start )
 #declare Camera_Y = 3.20;
#else
 #declare Camera_Y = 1.00
   + Jump_Height*
     0.9*(1.4-cos(4*pi*(clock-Jump_Start)));
#end 


#declare Camera_2 = camera {
                         angle 38
                         location <3,Camera_Y,-20>
                         right x*image_width/image_height
                         look_at <-3,3,5>
                         rotate<0,-360*(clock+0.1),5>
}
                            
                            
#declare domino=   box {
    <-1,0,-1>,< 0.5,3,0>
     texture { pigment{ rgb<0,0,0> }
                  finish { diffuse 0.9
                           phong 1}
                translate<25,0,-5>
                
                }
  }              
  
  
#declare esfera=   sphere{ <0,0,0>, 0.25
        texture { pigment{ rgb<1,0,0> }
                  finish { diffuse 0.9
                           phong 1}
                } 
        translate <-2.5,0.25,-1>
      scale<2,2,2>
        }              
                            
                            
camera{Camera_2}
// sun ---------------------------------------------------------------------
light_source{<1500,2500,-2500> color White}

// sky --------------------------------------------------------------- 

sky_sphere{ pigment{ gradient <0,1,0>
                     color_map{ [0   color rgb<0.24,0.34,0.56>*1.2]        
                                [0.5 color rgb<0.24,0.34,0.56>*0.4] 
                                [0.5 color rgb<0.24,0.34,0.56>*0.4] 
                                [1.0 color rgb<0.24,0.34,0.56>*1.2]          
                              }
                                     
                                     
                                     
                                     
                      rotate< 0,0, 0>  
                   
                     scale 2 }
           } 
           
          
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
 object{esfera}
 #for (i, 0,20, 1)

   object{ domino
           translate<2,0,i*2 >
         }

 #end 

 rotate<0,0,0>
 translate<0,0,0>
}

