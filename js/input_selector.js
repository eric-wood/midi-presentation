NOTE_ON  = 144;
NOTE_OFF = 128;

// THIS IS RIDICULOUS
NodeList.prototype.forEach = Array.prototype.forEach;

if(navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(populateIO);
}

function populateIO(midiAccess) {
  window.midiAccess = midiAccess; // cache this for later
  populateInputs(midiAccess);
  populateOutputs(midiAccess);
  render();
};

function render() {
  input.onmidimessage = midiMessage;
  displayMidiDevice(input, document.getElementById('display-input'));
  displayMidiDevice(output, document.getElementById('display-output'));
};

function populateInputs(midiAccess) {
  var select = document.getElementById('midi-inputs');
  var inputs = [];

  midiAccess.inputs.forEach(function(input) { inputs.push(input); });
  inputs = inputs.reverse();
  inputs.forEach(function(input) {
    var option = document.createElement('option');
    option.setAttribute('value', input.id);
    option.innerText = input.name;
    select.appendChild(option);
  });

  window.input = inputs[0];

  select.addEventListener('change', function() {
    window.input = window.midiAccess.inputs.get(this.value);
  });
};

function populateOutputs(midiAccess) {
  var select = document.getElementById('midi-outputs');
  var outputs = [];

  midiAccess.outputs.forEach(function(output) { outputs.push(output); });
  outputs = outputs.reverse();
  outputs.forEach(function(output) {
    var option = document.createElement('option');
    option.setAttribute('value', output.id);
    option.innerText = output.name;
    select.appendChild(option);
  });

  var change = function() {
    window.output = window.midiAccess.outputs.get(this.value);
    render();
  };

  window.output = outputs[0];

  select.addEventListener('change', function() {
    window.output = window.midiAccess.outputs.get(this.value);
    render();
  });
};

function displayMidiDevice(device, el) {
  var attrs = ["connection", "id", "manufacturer", "state", "type", "version"];

  var results = []
  attrs.forEach(function(attr) {
    var result = device[attr];
    if(typeof result === 'string') {
      result = '"' + result + '"';
    }

    results.push('  ' + attr + ': ' + result);
  });

  el.innerText = device.type + ` = {\n${results.join(',\n')}\n}`;
};

Reveal.addEventListener( 'slidechanged', function( event ) {
  console.log(event.currentSlide);
  // event.previousSlide, event.currentSlide, event.indexh, event.indexv
});

function midiMessage(message) {
  if(message.data[0] === 248) return; // ignore clock signal

  document.getElementById('read-result').innerText = `message.data = [${message.data}]`;

  document.querySelectorAll('.midi-message-type').forEach(function(el) {
    el.innerText = decodeMessageType(message.data[0]);
  });

  document.querySelectorAll('.midi-message-note').forEach(function(el) {
    el.innerText = decodeMessageNote(message.data[1]);
  });

  document.querySelectorAll('.midi-message-velocity').forEach(function(el) {
    el.innerText = message.data[2];
  });

  document.querySelectorAll('.wait-for-midi').forEach(function(el) {
    el.style.display = 'block';
  });

  json = `{
  type:     "${decodeMessageType(message.data[0])}",
  note:     ${message.data[1]},
  velocity: ${message.data[2]}
}`;
  document.getElementById('midi-translated').innerText = json;
};

function noteOn(note, velocity) {
  velocity = velocity || 127;
  output.send([NOTE_ON, note, 127]);
};

function noteOff(note) {
  output.send([NOTE_OFF, note, null]);
};


function makeNoise() {
  var note = document.getElementById('midi-note').value
  noteOn(note);
  setTimeout(function() {
    noteOff(note);
  }, 1000);
};
