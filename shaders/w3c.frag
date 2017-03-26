float mag ( vec3 v )
{
 return  sqrt(dot(v,v));   
}

vec3 sphere( vec3 c, float r, vec3 obs, vec3 Lpos, vec2 uv, vec3 diffuse_col,vec3 spec_col,vec3 I )
{
    if((uv.x-c.x)*(uv.x-c.x)+(uv.y-c.y)*(uv.y-c.y) < r*r) {
             
        vec3 s = vec3(uv,c.z-sqrt(r*r-(uv.x-c.x)*(uv.x-c.x)-(uv.y-c.y)*(uv.y-c.y)));//surface point
        float test = dot(s-obs,s-c);
        float t1 = acos(dot(obs-s,s-c)/(mag(s-obs)*mag(s-c)));
        float t2 = acos(dot(Lpos-s,s-c)/(mag(Lpos-s)*mag(s-c))); 

        vec2 diffspec = vec2(0.,0.);

        {
            diffspec.x += abs(t1-t2)/(PI);//diffuse
            diffspec.y += diffspec.x*diffspec.x*diffspec.x*diffspec.x*1.;//specular
            diffspec/=2.;
        }

        vec3 colour = diffuse_col*diffspec.x+spec_col*diffspec.y;
        return abs(colour);
    }else{
        return I;
    }
}

void main()
{
	vec2 uv = (gl_FragCoord.xy / resolution.xy - vec2(0.5,0.5))*2.0;

    vec3 obs = vec3(uv.x,uv.y,2.);
    vec3 Lpos = vec3(15.,10.,-1.);//light position
    vec3 Lcol = vec3(1.);
    
    vec3 c;
    float r;
    vec3 I =vec3(0.,0.,0.);
    
    float maxlen = 0.1;
    float dist= 0.0;
    float posx = 0.0;
    float posy = 0.0;
    float posz = 0.0;
    float originx = -bands.x;
    float originy =  bands.x;
    float originz = bands.z;
    float bx = 0.0;
    float by = 0.0;
    float bz = 0.0;
    vec3 dx[16];
    dx[0] = vec3(0.1,1.4,0.2);//*(mouse.x/resolution.x - 0.5);
    /*dx[1] = vec3(0.41,0.9,0.8);//*(mouse.y/resolution.y - 0.5);
    dx[2] = vec3(0.2,-0.2,0.3);//*(-mouse.y/resolution.y - 0.5);
    dx[3] = vec3(0.12,-0.12,0.13);//*(mouse.y/resolution.y - 0.5);
    dx[4] = vec3(0.3,0.2,0.3);
    dx[5] = vec3(-0.3,0.2,0.3);*/
    for (int d = 1; d < 16; d++) 
    {
        dx[d] = dx[d-1] - vec3(bands.x,bands.y,bands.z);
    }
    // center sphere
    r = 0.08;//*sin(time*0.25)*sin(time*0.25)+0.1;
    c = vec3(originx, originy,originz);
    I =  sphere( c, r, obs, Lpos, uv, vec3(1.,0.,0.),Lcol, I ) ;
    int numSph = int(time/60.);
    // number of first level branches
    for (int j = 0; j < 6; j++) 
    {
        posx = originx;//*float(j)*10.;
        posy = originy;
        posz = originz;

        for (int i = 0; i < 2; i++) 
        {
            vec3 bend = vec3(clamp(bands.y, 0.0, 0.01), clamp(bands.x, 0.0, 0.01), bands.z)*0.34;
            // first level branches
            for (int i = 0; i < 3; i++) 
            { 
                if (i >= numSph) { break; }
               //r = 0.2*sin(time/4.)*sin(time/4.)+0.02;
                c = vec3( posx, posy, posz);
                I = sphere( c, r, obs, Lpos, uv, vec3(0.411,float(j)*0.1,0.0),Lcol, I ) ;
         
                dist += 0.001;
                //posx += 0.01*(dx[j].x*(mouse.x/resolution.x -0.5) - bend.x);
                //posy -= 0.01*(dx[j].y*(mouse.y/resolution.y -0.5) + bend.y);
                bend += 0.1;
                if (i>0) {
                    bx = posx;
                    by = posy;
                    bz = posz;
                    // branches
                    for (int b = 0 ; b < 4 ; b++) 
                    {
                        bx -= 0.1;
                        by += 0.1;
                        bz -= 0.1;
                        c = vec3( bx, by, bz);
                        I = sphere( c, r, obs, Lpos, uv, vec3(0.411,float(j)*0.1,0.8),Lcol, I ) ;
                    }                   
                }
                posx += 0.2*dx[j].x*(mouse.x/resolution.x - 0.5) + bend.x;
                posy += 0.2*dx[j].y*(mouse.y/resolution.y - 0.5) + bend.y;
                posz += 0.2*dx[j].z*(-mouse.x/resolution.x - 0.5) + bend.z;

            }
            r-=0.001;
        }
    }
	gl_FragColor = vec4(I*2.9,1.);
}