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

const vec3 yellow = vec3(1.0, 0.851, 0.0);
const vec3 red = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0, 1.0, 0.0);
const vec3 blue = vec3(0.0, 0.0, 1.0);
uniform float u_note_intensity;
uniform float u_loopTime;
uniform bool u_playing;
uniform float u_playTime;
uniform float u_startPoint;
uniform bool u_activeInput;

const int MAX_NOTES = 64;
uniform float u_noteCount;
uniform float u_notes[MAX_NOTES];

const int MAX_INPUTS = 512;
uniform float u_mouseDownCount;
uniform float u_mouseDowns[MAX_INPUTS];
uniform float u_mouseUpCount;
uniform float u_mouseUps[MAX_INPUTS];

bool should_render_note(float note_start, float note_end, float time) {
  return !(time < note_start || time > note_end);
}

/*
parameters: px, wx

f(cx,cy) = c

f(cx,cy) =
  step(px - wx/2.0, cx) *
  step(cx - px, wx / 2.0)
*/

float calcTime(float time) {
  if (u_playing) {
    return u_startPoint + mod(time - u_playTime, u_loopTime);
  } else {
    return u_startPoint;
  }
}

vec3 slice(float frag, float pos, float length) {
  float rightSide = step(pos - length / 2.0, frag);
  float leftSide = step(frag - pos, length / 2.0 );
  return vec3(leftSide * rightSide);
}

vec3 rect(vec2 frag, vec2 pos, vec2 size) {
  vec2 bottomRight = step(pos - size / 2.0, frag);
  vec2 topLeft = step(frag - pos, size / 2.0);
  float draw = topLeft.x * bottomRight.x * topLeft.y * bottomRight.y;
  return vec3(draw);
}

vec3 render_note(float note_time, int note_lane, float time, vec2 frag) {
  vec3 note_color;
  if (note_lane == 0) {
    note_color = red;
  } else if (note_lane == 1) {
    note_color = green;
  } else {
    note_color = blue;
  }
  float x = 1.0 - note_time;
  float y = float(note_lane + 1) * 0.3 - 0.1;
	vec3 note = rect(frag, vec2(x, y), vec2(0.02, 0.3)) * note_color * u_note_intensity;
  return note;
}

vec3 render_note_old(float note_time, int note_lane, float time, vec2 frag) {
  vec3 note_color;
  if (note_lane == 0) {
    note_color = red;
  } else if (note_lane == 1) {
    note_color = green;
  } else {
    note_color = blue;
  }
	vec3 note = slice(frag.x, 1.0 - note_time, 0.02) * note_color * u_note_intensity;
  return note;
}

int notes_slipped(float time) {
  int slips = 0;
  for (int i = 0; i < MAX_NOTES; i += 3)
  {
    if(i >= int(u_noteCount)) {
      return slips;
    }
    float note_start = u_notes[i];
    float note_duration = u_notes[i+1];
    int note_lane = int(u_notes[i+2]);
    float note_end = note_start + note_duration;
    if(time > note_end) {
      slips++;
    }
  }
  return slips;
}

// This function loops over all potential slips, and adds
// the fragment color whenever it finds a slip.
// A potentially better way to do it may be to just calculate which slip
// the given frament is in, if any, and then check that exact slip
// to decide whether to color it in or not. See below function for an example of this.
vec3 render_slips(vec2 frag, float time) {
  int slips = notes_slipped(time);
  vec3 slips_vec = vec3(0,0,0);

  for (int i = 0; i < MAX_NOTES; i++)
  {
    if(i >= int(u_mouseDownCount)) {
      return slips_vec;
    }
    float mouseDownTime = u_mouseDowns[i];
    if(mouseDownTime >= 1.0) {
      slips_vec += rect(frag, vec2(0.925, 0.9  - (float(i) * 0.15)), vec2(0.05, 0.075)) * yellow;
    }
  }
  return slips_vec;
}

vec3 fragment_slip_number(vec2 frag, float time) {
  vec3 xValid = slice(frag.x, 0.925, 0.05);
  float slipPoint = (1.0 - frag.y) / 0.15;
  float coloredRegion = mod(slipPoint, 1.0);
  float colored = step(0.5, coloredRegion);
  int slipNumber = int(floor(slipPoint));
  // float evenRegion = mod(slipNumber, 2.0);
  float mouseDownTime = 0.0;
  for (int i = 0; i < MAX_NOTES; i++)
  {
    if(i == slipNumber) {
      mouseDownTime = u_mouseDowns[i];
    }
  }
  float mouseDownTimeValid = step(1.0, mouseDownTime);
  return xValid * mouseDownTimeValid * yellow * colored;
}

void main() {
  gl_FragColor = vec4(0,0,0,1);
	vec2 frag = gl_FragCoord.xy / u_resolution;
  float time = calcTime(u_time);

  vec3 digits = red * vec3(PrintDigits(gl_FragCoord.xy, grid(0,0), fontSize, time, 4.0));
  if (bool(digits)) {
    gl_FragColor = vec4(digits, 1.0);
    return;
  }

  vec3 barrier = slice(frag.x, 0.05, 0.02);
  if (bool(barrier)) {
    gl_FragColor = vec4(barrier, 1.0);
    return;
  }

  if(u_activeInput) {
    vec3 inputSlice = slice(frag.x, 0.05, 0.04) * vec3(0.5 ,0.5 , 0.5);
    if (bool(inputSlice)) {
      gl_FragColor = vec4(inputSlice, 1.0);
      return;
    }
  }

  vec3 lives = fragment_slip_number(frag, time);
  if (bool(lives)) {
    gl_FragColor = vec4(lives, 1.0);
    return;
  }

  for (int i = 0; i < MAX_NOTES; i += 3)
  {
    if(i >= int(u_noteCount)) {
      return;
    }
    float note_start = u_notes[i];
    float note_duration = u_notes[i+1];
    int note_lane = int(u_notes[i+2]);
    float note_end = note_start + note_duration;
    if(should_render_note(note_start, note_end, time)) {
      float note_time = (time - note_start)/(note_end - note_start); // time of note animation from 0 -> 1
      vec3 note = render_note(note_time, note_lane, time, frag);
      gl_FragColor += vec4(note, 1.0);
    }
  }

}
