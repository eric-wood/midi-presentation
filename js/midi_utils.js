function decodeMessageType(type) {
  var result = '';

  if(type >= 80 && type <= 143) {
    result = 'note off';
  } else if(type >= 144 && type <= 159) {
    result = 'note on';
  } else if(type >= 160 && type <= 175) {
    result = 'polyphonic aftertouch';
  } else if(type >= 176 && type <= 191) {
    result = 'control change';
  } else if(type >= 192 && type <= 207) {
    result = 'program change'
  } else if(type >= 208 && type <= 223) {
    result = 'channel aftertouch';
  } else if(type >= 224 && type <= 239) {
    result = 'pitch wheel range';
  } else {
    result = type;
  }

  return result;
};

function decodeMessageNote(note) {
  var notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var midis = [];
  var noteIndex = 0;
  for(var i=0; i < 128; i++) {
    midis.push(notes[noteIndex]);
    noteIndex++;
    if(noteIndex >= notes.length) { noteIndex = 0; }
  }

  return midis[note];
};


