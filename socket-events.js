import {saveRequest, fetchNearestCops, updateRequest} from './db/db-operations.js';
import mongoose from 'mongoose';
import {Server} from 'socket.io';

function initialize(server) {
	const io = new Server(server);

	io.on('connection', (socket) => { 
		console.log('A user just connected');

		socket.on('join', (data) => { 
			socket.join(data.userId); 
			console.log(`User joined room: ${data.userId}`);
		});

		socket.on('request-for-help', async (eventData) => {

			const requestTime = new Date(); 
			const requestId = new mongoose.Types.ObjectId(); 

			const location = { 
				coordinates: [
					eventData.location.longitude,
					eventData.location.latitude
				],
				address: eventData.location.address
			};

			await saveRequest(requestId, requestTime, location, eventData.civilianId, 'waiting');

			const nearestCops = await fetchNearestCops(location.coordinates, 2000);
			eventData.requestId = requestId;

			for (let i = 0; i < nearestCops.length; i++) {
				io.sockets.in(nearestCops[i].userId).emit('request-for-help', eventData);
			}

		});

		socket.on('request-accepted', async (eventData) => { 
			console.log('eventData contains: ', eventData);

			const requestId = new mongoose.Types.ObjectId(eventData.requestDetails.requestId);

			await updateRequest(requestId, eventData.copDetails.copId, 'engaged');

			io.sockets.in(eventData.requestDetails.civilianId).emit('request-accepted', eventData.copDetails);
		});

	});
}

export default initialize;