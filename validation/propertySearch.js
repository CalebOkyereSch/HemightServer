const Validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = function propertySearch(data) {
  let errors = {};
  data.type = !isEmpty(data.type) ? data.type : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.minPrice = !isEmpty(data.minPrice) ? data.minPrice : "";
  data.maxPrice = !isEmpty(data.maxPrice) ? data.maxPrice : "";
  data.bed = !isEmpty(data.bed) ? data.bed : "";
  data.bath = !isEmpty(data.bath) ? data.bath : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.rooms = !isEmpty(data.rooms) ? data.rooms : "";

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type Field Is Required";
  }
  if (Validator.isEmpty(data.rooms)) {
    errors.rooms = "Rooms Field Is Required";
  }
  if (Validator.isEmpty(data.location)) {
    errors.location = "Location field required";
  }
  if (Validator.isEmpty(data.minPrice)) {
    errors.minPrice = "Minimum Price Field Is Required";
  }
  if (Validator.isEmpty(data.maxPrice)) {
    errors.maxPrice = "Maximum Price field required";
  }
  if (Validator.isEmpty(data.bed)) {
    errors.bed = "Bedrooms Field Is Required";
  }
  if (Validator.isEmpty(data.bath)) {
    errors.bath = "Bathrooms field required";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "Status Field Is Required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
