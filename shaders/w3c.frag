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
    float zoom = 1.0+time/60.0;
	vec2 uv = (gl_FragCoord.xy / resolution.xy - vec2(0.5,0.3))*zoom;

    vec3 obs = vec3(uv.x,uv.y,2.);
    // light position
    vec3 Lpos = vec3(15.,10.,-1.);
    vec3 Lcol = vec3(1.);
     
    float maxlen = 0.1, posx = 0.0, posy = 0.0, posz = 0.0;
    float factor = 8.0;
    float distfactor = time/404.0;
    float mouseFactor = 30.0;
    float energyx = bands.x / factor;
    float energyy = bands.y / factor;
    float energyz = bands.z / factor;

    float originx = -energyx, originy = energyy, originz = energyz;
    float bx = 0.0, by = 0.0, bz = 0.0;
    vec2 dx[16];
    float mx = (mouse.x/resolution.x-0.6)/60.;
    float my = (mouse.y/resolution.y-0.6)/60.;
    float distanceFromOrigin = 0.05;
    dx[0] = vec2(distanceFromOrigin+mx,distanceFromOrigin-my);
    dx[1] = vec2(distanceFromOrigin+mx,-distanceFromOrigin-my);
    dx[2] = vec2(-distanceFromOrigin+mx,-distanceFromOrigin-my);
    dx[3] = vec2(-distanceFromOrigin+mx,distanceFromOrigin-my);

    for (int d = 4; d < 16; d++) {
        dx[d] = dx[d-1] - vec2(energyx, energyy);
    }
    // center sphere
    vec3 c = vec3(originx, originy, originz);
    float r = min(0.08,time/100.0);//*sin(time*0.25)*sin(time*0.25)+0.1;
    vec3 I = vec3(bands.x/12.0,0.,0.);
    if (time > 177. && time < 203.) {
        I = vec3(0.1,0.,0.2);
    }
    I = sphere( c, r, obs, Lpos, uv, vec3(0.2,0.,0.4),Lcol, I ) ;
    int numBranches =int(time/10.);// FINAL int(time/23.);
    int numSph = int(time/5.);
    //int numBranches =int(mouse.x/100.);// FINAL int(time/23.);
    
    // number of first level branches
    for (int j = 0; j < 10; j++) {
        posx = originx; posy = originy; posz = originz;
        r = min(0.08,time/100.0);
        if (j >= numBranches) { break; }
        
        uv = rotate(uv, vec2(0.), float(j)*PI/3.);
        for (int k = 0; k < 12; k++) { 
            if (k >= numSph) { break; }           
            
            // first level branches
            c = vec3( posx, posy, posz);
            I = sphere( c, r, obs, Lpos, uv, vec3(float(k)*0.2,bands.x/1.3,0.4),Lcol, I ) ;
            posx += distfactor * dx[j+int(mod(float(k),4.))].x * (mouse.x/mouseFactor/resolution.x - 0.5);
            posy += distfactor * dx[j+int(mod(float(k),8.))].y * (mouse.y/mouseFactor/resolution.y - 0.5);
            r-=0.0051;
        }        
    }
    // intro
    if (time < 23.) {
        // scanlines
        I += 0.1*sin(uv.y*resolution.y*2.0);
    
        // screen flicker
        I += 0.005 * sin(time*16.0);
    }
    // break
    if (time > 100. && time < 111.) {
        // scanlines
        I += 0.1*sin(uv.y*resolution.y*2.0);
    
        // screen flicker
        I += 0.005 * sin(time*16.0);
    }
    
	gl_FragColor = vec4(I*2.9*(bands.x+0.01),1.);
}