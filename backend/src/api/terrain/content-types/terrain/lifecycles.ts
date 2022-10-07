
const { ValidationError } = require("@strapi/utils").errors;
function validateTerrain(event){
    const start = new Date(event.params.data.start);
    const end =  new Date(event.params.data.end);

    // end must be greater than start
    if(end.getTime() <= start.getTime()){
        // ref -> https://forum.strapi.io/t/throw-error-message-in-lifecycle-hook-doesnt-change-the-error-message-display-in-the-ui/1515/14
        throw new ValidationError("end must be set after start");  
    }
}

export default {
  beforeCreate(event) {
    validateTerrain(event);
  },
  beforeUpdate(event) {
    validateTerrain(event);
  },
  beforeUpdateMany(event) {
    validateTerrain(event);
  }
}