jsPsych.plugins["psychophysics_modified"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "psychophysics_modified",
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: undefined
      },
      response_type: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'mouse'
      },
      background_color: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'white'
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    display_element.innerHTML = "";
    display_element.appendChild(canvas);

    var ctx = canvas.getContext("2d");

    // Draw each stimulus
    trial.stimuli.forEach(function(stim) {
      if (stim.drawFunc) {
        stim.drawFunc(stim, canvas, ctx);
      }
    });

    // End trial (you can customize this)
    var end_trial = function() {
      jsPsych.finishTrial({});
    };

    // Example: end after click
    if (trial.response_type === 'mouse') {
      canvas.addEventListener('mousedown', end_trial);
    }

  };

  return plugin;

})();
