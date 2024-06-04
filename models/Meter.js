const mongoose=require('mongoose');
const joi=require('joi');
require('dotenv').config();


const meterSchema = new mongoose.Schema({
    voltage: { type: String, required: true },
    current: { type: String, required: true },
    energy: { type: String, required: true },
    frequency: { type: String, required: true },
    pf: { type: String, required: true },
    date: {type:Date,default:Date.now()},
});

const validateMeter = (data) => {
     const schema = joi.object({
          voltage: joi.string().required().label('Voltage'),
          current: joi.string().required().label('Current'),
          energy: joi.string().email().required().label('energy'),
          frequency: joi.string().email().required().label('Frequency'),
          pf: joi.string().email().required().label('Power Factor'),
     });
     return schema.validate(data);
};

const Meter=mongoose.model('Meter',meterSchema);


  
module.exports={
     Meter,
     validateMeter
 }
