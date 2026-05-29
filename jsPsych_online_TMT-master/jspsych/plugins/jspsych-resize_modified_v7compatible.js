jsPsych.plugins["resize_modified"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "resize_modified",
    parameters: {
      item_width: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: null
      },
      item_height: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: null
      },
      pixels_per_unit: {
        type: jsPsych.plugins.parameterType.FLOAT,
        default: 100
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ""
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "Continue"
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = `
      <div>
        ${trial.prompt}
        <div id="resize-box" style="
          width:200px;
          height:150px;
          border:2px solid red;
          resize:both;
          overflow:auto;
          margin:20px auto;">
        </div>
        <button id="resize-btn">${trial.button_label}</button>
      </div>
    `;

    document.getElementById("resize-btn").onclick = function() {

      var box = document.getElementById("resize-box");

      var width = box.offsetWidth;
      var pixels_per_unit = width / trial.item_width;

      jsPsych.finishTrial({
        pixels_per_unit: pixels_per_unit
      });
    };
  };

  return plugin;

})();
