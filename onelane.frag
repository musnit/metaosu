#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

/*

parameters: px, wx

f(cx,cy) = c

f(cx,cy) = step(cx,px) * step(wx, px - cx)

*/

float rectshape(vec2 position, vec2 scale){
	scale = vec2(0.5) - scale * 0.5;
	vec2 shaper = vec2(step(scale.x, position.x), 1.0);
	shaper *= vec2(step(scale.x, 1.0 - position.x), 1.0);
	return shaper.x;
}

vec3 f(vec2 coord, float px, float wx) {
  vec2 rightSide = vec2(step(px - wx/2.0,coord.x), 1.0);
  vec2 leftSide = vec2(step(px + wx/2.0, 1.0 - coord.x + wx), 1.0);
  return vec3(leftSide.x * rightSide.x);
}

// void main(){
// 	vec2 position = gl_FragCoord.xy / u_resolution;

// 	vec3 color = vec3(0.0);

// 	float rectangle = rectshape(position, vec2(0.2, 1.0));

// 	color = vec3(rectangle);

// 	gl_FragColor = vec4(color, 1.0);
// }

void main(){
	vec2 position = gl_FragCoord.xy /u_resolution;

	vec3 color = f(position, 0.5, 0.5);

	gl_FragColor = vec4(color, 1.0);
}
