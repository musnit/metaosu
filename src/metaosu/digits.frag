#ifdef GL_ES
precision mediump float;
#endif

// libs
float DigitBin(const in int x)
{
    return x==0?480599.0:x==1?139810.0:x==2?476951.0:x==3?476999.0:x==4?350020.0:x==5?464711.0:x==6?464727.0:x==7?476228.0:x==8?481111.0:x==9?481095.0:0.0;
}

float PrintDigits(vec2 fragCoord, vec2 pixelCoord, vec2 fontSize, float value, float decimals) {
	vec2 charCoord = (fragCoord - pixelCoord) / fontSize;
	if(charCoord.y < 0.0 || charCoord.y >= 1.0) return 0.0;
	float bits = 0.0;
  float digits = max(floor(log(value)/log(10.0)), 0.0);
	float digitIndex1 = digits - floor(charCoord.x)+ 1.0;
	if(- digitIndex1 <= decimals) {
		float pow1 = pow(10.0, digitIndex1);
		float absValue = abs(value);
		float pivot = max(absValue, 1.5) * 10.0;
		if(pivot < pow1) {
			if(value < 0.0 && pivot >= pow1 * 0.1) bits = 1792.0;
		} else if(digitIndex1 == 0.0) {
			if(decimals > 0.0) bits = 2.0;
		} else {
			value = digitIndex1 < 0.0 ? fract(absValue) : absValue * 10.0;
			bits = DigitBin(int (mod(value / pow1, 10.0)));
		}
	}
	return floor(mod(bits / pow(2.0, floor(fract(charCoord.x) * 4.0) + floor(charCoord.y * 5.0) * 4.0), 2.0));
}

// Multiples of 4x5 work best
vec2 fontSize = vec2(4,5) * vec2(5,4);

vec2 grid(int x, int y) { return fontSize.xx * vec2(1,ceil(fontSize.y/fontSize.x)) * vec2(x,y) + vec2(2); }

// own code

uniform vec2 u_resolution;
uniform float u_time;

// float a[5] = float[5](3.4, 4.2, 5.0, 5.2, 1.1);
uniform float myValues[12];

/*
const notes = [
  ['green', 3000],
  ['red', 7000],
  ['blue', 8000],
  ['green', 10000],
  ['green', 11000],
]
*/

/*
parameters: px, wx

f(cx,cy) = c

f(cx,cy) =
  step(px - wx/2.0, cx) *
  step(cx - px, wx / 2.0)
*/

vec3 vertical_slice(vec2 frag, float pos, float width) {
  vec2 rightSide = vec2(step(pos - width / 2.0, frag.x), 1.0);
  vec2 leftSide = vec2(step(frag.x - pos, width / 2.0 ), 1.0);
  return vec3(leftSide.x * rightSide.x);
}


const vec3 red = vec3(1.0, 0.0, 0.0);
const float fDecimalPlaces = 4.0;
uniform float u_blueness;
uniform float u_loopTime;
uniform float u_seekTime;

void main(){
	vec2 frag = gl_FragCoord.xy / u_resolution;
  float time = u_seekTime + u_time;
  float time_abs = mod(time, u_loopTime);

  vec3 digits = red * vec3(PrintDigits(gl_FragCoord.xy, grid(0,0), fontSize, time_abs, fDecimalPlaces));
  if(bool(digits)) {
    gl_FragColor = vec4(digits, 1.0);
    return;
  }

  float time_rel = time_abs / u_loopTime;

  vec3 barrier = vertical_slice(frag, 0.05, 0.02);
  if(bool(barrier)) {
    gl_FragColor = vec4(barrier, 1.0);
    return;
  }

	vec3 note = vertical_slice(frag, 1.0 - time_rel, 0.02) * vec3(0.0,0.0,u_blueness);

	gl_FragColor = vec4(note, 1.0);
}
