#version 3.7;
global_settings {  assumed_gamma 1.0 }
#default{ finish{ ambient 0.1 diffuse 0.9 }} 
//--------------------------------------------------------------------------
#include "colors.inc"
#include "textures.inc"
#include "woods.inc"
#include "shapes.inc"
#include "shapes2.inc"
#include "functions.inc"
#include "math.inc"
#include "transforms.inc"
#include "skies.inc"

#declare RasterScale = 2.0;
#declare RasterHalfLine  = 0.035;  
#declare RasterHalfLineZ = 0.035;
#declare lista = array[100]; 
//-------------------------------------------------------------------------

  #declare r_violet1 = color rgbf<1.0, 0.5, 1.0, 1.0>;
  #declare r_violet2 = color rgbf<1.0, 0.5, 1.0, 0.8>;
  #declare r_indigo  = color rgbf<0.5, 0.5, 1.0, 0.8>;
  #declare r_blue    = color rgbf<0.2, 0.2, 1.0, 0.8>;
  #declare r_cyan    = color rgbf<0.2, 1.0, 1.0, 0.8>;
  #declare r_green   = color rgbf<0.2, 1.0, 0.2, 0.8>;
  #declare r_yellow  = color rgbf<1.0, 1.0, 0.2, 0.8>;
  #declare r_orange  = color rgbf<1.0, 0.5, 0.2, 0.8>;
  #declare r_red1    = color rgbf<1.0, 0.2, 0.2, 0.8>;
  #declare r_red2    = color rgbf<1.0, 0.2, 0.2, 1.0>;



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

                         angle 100
                         location <3,Camera_Y,-20>
                         right x*image_width/image_height
                         look_at <2,2,-3>
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
      translate <2,0.25,-8>
      scale<2,2,2>
      }

                            
#declare figura=   box {
    <-1,0,-1>,< 0.5,3,0>
     texture {DMFWood4 
                  finish { diffuse 1.2
                           phong 1}
               
                translate<0,0,0>
                
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
light_source{<1500,2500,-2500> color White}
sky_sphere {S_Cloud2}
          
                 
# macro create()
   
union{
object{ball
    translate <-9,0,3.2*clock>
 }
 
    
 #for (i, 0,20, 1)  
    object{domino_four translate<-5,0,(i*2)>}
    object{domino_two translate<-6.3-(i*1.2),0,-2+(i*2)>}
    object{domino_two translate<-3.7+(i*1.2),0,-2+(i*2)>}
 #end 
 

 #for (i, 0,4,1)
 object{domino_four translate<-5,0,(-11.5+(i*2))>}
 object{domino_four translate<-6.9,0,2+(i*2)>}
 object{domino_four translate<-3.1,0,2+(i*2)>}
#end
 
 rotate<0,0,0>
 translate<5,0,0>
} 
#end  



# macro animate3()
#declare h=0; 
union{
object{ball
    translate <-9,0,8>
 }
 
    
 #for (i, 0,20, 1)  
    object{domino_four translate<-5,h,i>rotate<45,0,0>}
    object{domino_two translate<-6.3-(i*1.2),h,i>rotate<45,0,0>}
    object{domino_two translate<-3.7+(i*1.2),h,i>rotate<45,0,0>}
    #declare h=h+1;
 #end 
 
#declare h=0;
 #for (i, 0,4,1)
 object{domino_four translate<-5,h-5.2,(-5+i)>rotate<45,0,0>}
 object{domino_four translate<-6.9,h,i>rotate<45,0,0>}
 object{domino_four translate<-3.1,h,i>rotate<45,0,0>}
 #declare h=h+1;
#end
 
 rotate<0,0,0>
 translate<5,0,-5>
}          
    
#end 



# macro animate1()
union{
object{ball
    translate <-9,0,8>
 }
 
    
 #for (i, 0,20, 1)  
    object{domino_four translate<-5,0,(i*2)>}
    object{domino_two translate<-6.3-(i*1.2),0,-2+(i*2)>}
    object{domino_two translate<-3.7+(i*1.2),0,-2+(i*2)>}
 #end 
 
#declare h=0;
 #for (i, 0,4,1)
 object{domino_four translate<-5,h-5.2,(-5+i)>rotate<45,0,0>}
 object{domino_four translate<-6.9,0,2+(i*2)>}
 object{domino_four translate<-3.1,0,2+(i*2)>}
 #declare h=h+1;
#end
 
 rotate<0,0,0>
 translate<5,0,-5>
}          
    
#end


# macro animate2()
#declare h=0; 
union{
object{ball
    translate <-9,0,8>
 }
 
    
 #for (i, 0,20, 1)  
    object{domino_four translate<-5,0,(i*2)>}
    object{domino_two translate<-6.3-(i*1.2),h,i>rotate<45,0,0>}
    object{domino_two translate<-3.7+(i*1.2),h,i>rotate<45,0,0>}
    #declare h=h+1;
 #end 
 
#declare h=0;
 #for (i, 0,4,1)
 object{domino_four translate<-5,h-5.2,(-5+i)>rotate<45,0,0>}
 object{domino_four translate<-6.9,0,2+(i*2)>}
 object{domino_four translate<-3.1,0,2+(i*2)>}
 #declare h=h+1;
#end
 
 rotate<0,0,0>
 translate<5,0,-5>
}          
    
#end





 rainbow {
    angle 42.5
    width 5
    distance 1.0e7
    direction <-0.2, -0.2, 1>
    jitter 0.01
    color_map {
      [0.000  color r_violet1 transmit 0.45]
      [0.100  color r_violet2 transmit 0.45]
      [0.214  color r_indigo transmit 0.45]
      [0.328  color r_blue transmit 0.45]
      [0.442  color r_cyan transmit 0.45]
      [0.556  color r_green transmit 0.45]
      [0.670  color r_yellow transmit 0.45]
      [0.784  color r_orange transmit 0.45]
      [0.900  color r_red1 transmit 0.45]
    }
  }       
                 
plane { <0,1,0>, 0
        texture { pigment{color White*1.1}
                  finish {ambient 0.45 diffuse 0.85}}
        texture { Raster(RasterScale,RasterHalfLine ) rotate<0,0,0> }
        texture { Raster(RasterScale,RasterHalfLineZ) rotate<0,90,0>}
        rotate<0,0,0>
      }
   
   
#if(frame_number<=45)
     
     create()
#end
#if(frame_number>=46 & frame_number<=49 )
animate1()      
#end
#if(frame_number>49 & frame_number<=52)
animate2()      
#end
#if(frame_number>52)
animate3()      
#end

  


