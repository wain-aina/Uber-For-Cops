import mongoose from 'mongoose';

const copSchema = mongoose.Schema({
	userId: { type: String, unique: true, required: true, trim: true },
	displayName: { type: String, trim: true },
	phone: { type: String },
	email: { type: String, unique: true },
	earnedRatings: { type: Number },
	totalRatings: { type: Number },
	location: {
		type: {
			type: String,
			required: true,
			default: "Point"
		},
		address: { type: String },
		coordinates: [ Number ],
	}
});

const requestSchema = mongoose.Schema({
	requestTime: { type: Date },
	location: {
		coordinates: [ Number ],
		adress: { type: String }
	},
	civilianId: { type: String },
	copId: { type: String },
	status: { type: String }
});

copSchema.index({"location": "2dsphere", userId: 1});

const Request = mongoose.model('Request', requestSchema);
const Cop = mongoose.model('Cop', copSchema);

export {Request, Cop};