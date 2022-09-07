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
const vec3 green = vec3(0, 1.0, 0.0);
const vec3 blue = vec3(0.0, 0.0, 1.0);
const float fDecimalPlaces = 4.0;
uniform float u_note_intensity;
uniform float u_loopTime;
uniform bool u_playing;
uniform float u_playTime;
uniform float u_startPoint;
uniform bool u_activeInput;

const int MAX_NOTES = 24;
uniform float u_noteCount;
uniform float u_notes[MAX_NOTES];

vec3 render_note(float note_start, float note_duration, int note_lane, float time, vec2 frag) {
  float note_end = note_start + note_duration;
  if (time < note_start || time > note_end) {
    return vec3(0.0);
  }
  float note_time = (time - note_start)/(note_end - note_start); // time of note animation from 0 -> 1
  vec3 note_color;
  if (note_lane == 0) {
    note_color = red;
  } else if (note_lane == 1) {
    note_color = green;
  } else {
    note_color = blue;
  }
	vec3 note = vertical_slice(frag, 1.0 - note_time, 0.02) * note_color * u_note_intensity;
  return note;
}

void main() {
	vec2 frag = gl_FragCoord.xy / u_resolution;
  float time;
  if (u_playing) {
    time = u_startPoint + mod(u_time - u_playTime, u_loopTime);
  } else {
    time = u_startPoint;
  }

  vec3 digits = red * vec3(PrintDigits(gl_FragCoord.xy, grid(0,0), fontSize, time, fDecimalPlaces));
  if (bool(digits)) {
    gl_FragColor = vec4(digits, 1.0);
    return;
  }

  vec3 barrier = vertical_slice(frag, 0.05, 0.02);
  if (bool(barrier)) {
    gl_FragColor = vec4(barrier, 1.0);
    return;
  }

  if(u_activeInput) {
    vec3 inputSlice = vertical_slice(frag, 0.05, 0.04) * vec3(0.5 ,0.5 , 0.5);
    if (bool(inputSlice)) {
      gl_FragColor = vec4(inputSlice, 1.0);
      return;
    }
  }

  for (int i = 0; i < MAX_NOTES; i += 3)
  {
    if(i >= int(u_noteCount)) {
      return;
    }
    float note_start = u_notes[i];
    float note_duration = u_notes[i+1];
    int note_lane = int(u_notes[i+2]);
    vec3 note = render_note(note_start, note_duration, note_lane, time, frag);
    gl_FragColor += vec4(note, 1.0);
  }

}
