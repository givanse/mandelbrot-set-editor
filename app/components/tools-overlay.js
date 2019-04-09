import Component from '@ember/component';

export default Component.extend({

  inMSetPickerComponents: null,

  init() {
    this._super(...arguments);
    this.inMSetPickerComponents = {
      preview: true,
      opacity: false,
      hue: true,
    
      interaction: {
        hex: false,
        rgba: false,
        hsla: true,
        hsva: false,
        input: false,
        clear: false,
        save: true
      }
    };
  },

  actions: {
    selectTool(toolName) {
      this.selectTool(toolName);
    },

    updateMaxAccel(ev) {
      const maxAccel = Number.parseInt(ev.target.value);
      this.updatePlotProperties({maxAccel});
    },

    updateSize(ev) {
      const size = Number.parseInt(ev.target.value);
      this.updatePlotProperties({size});
    },
  }
});
