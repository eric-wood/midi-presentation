if(navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(populateIO);
}

function populateIO(midiAccess) {
  window.midiAccess = midiAccess; // cache this for later
  populateInputs(midiAccess);
  populateOutputs(midiAccess);
};

function populateInputs(midiAccess) {
  var select = document.getElementById('midi-inputs');
  midiAccess.inputs.forEach(function(input) {
    var option = document.createElement('option');
    option.setAttribute('value', input.id);
    option.innerText = input.name;
    select.appendChild(option);
  });

  window.input = window.midiAccess.inputs.values().next().value;

  select.addEventListener('change', function() {
    window.input = window.midiAccess.inputs.get(this.value);
  });
};

function populateOutputs(midiAccess) {
  var select = document.getElementById('midi-outputs');
  midiAccess.outputs.forEach(function(output) {
    var option = document.createElement('option');
    option.setAttribute('value', output.id);
    option.innerText = output.name;
    select.appendChild(option);
  });

  var change = function() {
    window.output = window.midiAccess.outputs.get(this.value);
  };

  window.output = window.midiAccess.outputs.values().next().value;

  select.addEventListener('change', function() {
    window.output = window.midiAccess.outputs.get(this.value);
  });
};
