float mag ( vec3 v ) { return sqrt(dot(v,v)); }


vec3 sphere( vec3 c, float r, vec3 obs, vec3 Lpos, vec2 uv, vec3 diffuse_col,vec3 spec_col,vec3 I ) {
    if((uv.x-c.x)*(uv.x-c.x)+(uv.y-c.y)*(uv.y-c.y) < r*r) {             
        vec3 s = vec3(uv,c.z-sqrt(r*r-(uv.x-c.x)*(uv.x-c.x)-(uv.y-c.y)*(uv.y-c.y)));//surface point
        float test = dot(s-obs,s-c);
        float t1 = acos(dot(obs-s,s-c)/(mag(s-obs)*mag(s-c)));
        float t2 = acos(dot(Lpos-s,s-c)/(mag(Lpos-s)*mag(s-c))); 
        vec2 diffspec = vec2(0.,0.);
        diffspec.x += abs(t1-t2)/(PI);//diffuse
        diffspec.y += diffspec.x*diffspec.x*diffspec.x*diffspec.x*1.;//specular
        diffspec/=2.;
        vec3 colour = diffuse_col*diffspec.x+spec_col*diffspec.y;
        return abs(colour);
    } else {
        return I;
    }
}

void main() {
	vec2 uv = (gl_FragCoord.xy / resolution.xy - vec2(0.4,0.3))*2.0;

    vec3 obs = vec3(uv.x,uv.y,2.);
    vec3 Lpos = vec3(15.,10.,-1.);//light position
    vec3 Lcol = vec3(1.);
     
    float maxlen = 0.1, posx = 0.0, posy = 0.0, posz = 0.0;
    float factor = 8.0;
    float distfactor = time/24.0;
    float mouseFactor = 30.0;
    float energyx = (bands.x / factor -0.75);
    float energyy = bands.y / factor;
    float energyz = bands.z / factor;

    float originx = -energyx, originy = energyy, originz = energyz;
    float bx = 0.0, by = 0.0, bz = 0.0;
    vec2 dx[16];
    float mx = (mouse.x/resolution.x-0.6)/60.;
    float my = (mouse.y/resolution.y-0.6)/60.;
    float distFromCenter = 0.05;
    dx[0] = vec2(distFromCenter+mx,distFromCenter-my);//*(mouse.x/resolution.x - 0.5);
    dx[1] = vec2(distFromCenter+mx,-distFromCenter-my);//*(mouse.x/resolution.x - 0.5);
    dx[2] = vec2(-distFromCenter+mx,-distFromCenter-my);//*(mouse.x/resolution.x - 0.5);
    dx[3] = vec2(-distFromCenter+mx,distFromCenter-my);//*(mouse.x/resolution.x - 0.5);

    for (int d = 4; d < 16; d++) {
        dx[d] = dx[d-1] - vec2(energyx, energyy);
    }
    // center sphere
    vec3 c = vec3(originx, originy, originz);
    float r = min(0.08,time/100.0);//*sin(time*0.25)*sin(time*0.25)+0.1;
    vec3 I = vec3(0.,0.,0.);
    I = sphere( c, r, obs, Lpos, uv, vec3(0.2,0.,0.4),Lcol, I ) ;
    int numBranches =int(time/3.);// FINAL int(time/23.);
    int numSph = int(time/23.);
    // number of first level branches
    for (int j = 0; j < 4; j++) {
        posx = originx; posy = originy; posz = originz;
        r = min(0.08,time/100.0);
        if (j >= numBranches) { break; }
        for (int k = 0; k < 12; k++) {           
            vec3 bend = vec3(mx, energyx, energyz)*0.64;
            // first level branches
                posx += distfactor * dx[j+int(mod(float(k),4.))].x + energyx/10. ;// + bend.x;//* (mouse.x/mouseFactor/resolution.x - 0.5)
                posy += distfactor * dx[j].y ;// + bend.y;//* (mouse.y/mouseFactor/resolution.y - 0.5)
                //posz += distfactor * dx[j].z * (-mouse.x/mouseFactor/resolution.x - 0.5) + bend.z;
                c = vec3( posx, posy, posz);
                I = sphere( c, r, obs, Lpos, uv, vec3(float(k)*0.42,bands.x/1.3,0.4),Lcol, I ) ;
               /* if (mod(float(k),4.)==0.) {
                    bx = posx; by = posy; bz = posz;
                    // branches
                    for (int b = 0 ; b < 4 ; b++) {
                        bx -= distfactor; by += distfactor; bz -= distfactor;
                        c = vec3( bx, by, bz);
                        I = sphere( c, r, obs, Lpos, uv, vec3(0.411,float(j)*0.1,0.8),Lcol, I ) ;
                    }  
                }*/
           /* for (int i = 0; i < 3; i++) { 
               if (i >= numSph) { break; } 
               //r = 0.2*sin(time/4.)*sin(time/4.)+0.02;
         
                //posx += 0.01*(dx[j].x*(mouse.x/resolution.x -0.5) - bend.x);
                //posy -= 0.01*(dx[j].y*(mouse.y/resolution.y -0.5) + bend.y);
                bend += 0.1;
                if (i > 2) {
                    bx = posx; by = posy; bz = posz;
                    // branches
                    for (int b = 0 ; b < 4 ; b++) {
                        bx -= distfactor; by += distfactor; bz -= distfactor;
                        c = vec3( bx, by, bz);
                        I = sphere( c, r, obs, Lpos, uv, vec3(0.411,float(j)*0.1,0.8),Lcol, I ) ;
                    }                   
                }
            }*/
            r-=0.0051;
        }
    }
	gl_FragColor = vec4(I*2.9*bands.x,1.);
}