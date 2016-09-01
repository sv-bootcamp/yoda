import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let skillSchema = new Schema({
    name: String,
});

skillSchema.set('toJSON', {
    getters: true,  // bring all elements include virtuals
    virtuals: true,  // To have all virtuals show up in your console.log output
  });

export default mongoose.model('skill', skillSchema);
