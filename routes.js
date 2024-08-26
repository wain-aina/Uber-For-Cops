import express from 'express';
const router = express.Router();
import {fetchNearestCops, fetchCopDetails} from './db/db-operations.js';

router.get('/civilian.html', (req, res) => {
    res.render('civilian.html', {
        userId: req.query.userId
    });
});

router.get('/cop.html', (req, res) => {
    res.render('cop.html', {
        userId: req.query.userId
    });
});

router.get('/data.html', (req, res) => {
    res.render('data.html');
});

router.get('/cops', async (req, res) => {

    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const nearestCops = await fetchNearestCops([longitude, latitude], 2000);

    res.json({
        cops: nearestCops
    });
});

router.get('/cops/info', async (req, res) => {
    const userId = req.query.userId 
    const copDetails = await fetchCopDetails(userId);

    res.json({
        copDetails: copDetails
    });
});


export default router;
