const express = require('express');
const axios = require('axios');

const {
  getLocationFromQuery,
  setSettingsFromQuery,
  weather,
} = require('../../utils');

const router = express.Router();
weather.setAuth({ app_code: process.env.APP_CODE, app_id: process.env.APP_ID });

router.get('/ip2location', async (req, res) => {
  try {
    const { data: ipAddress } = await axios('https://api.ipify.org?format=json');
    const { data: locationInfo } = await axios.get(
      `http://api.ipstack.com/${ipAddress.ip}?access_key=${
        process.env.IP_STACK
      }&format=1`,
    );
    const {
      latitude, longitude, city, region_code,
    } = locationInfo;
    return res.status(200).json({
      latitude, longitude, city, region_code,
    });
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

router.get('/simple', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    setSettingsFromQuery(req.query);
    weather.location(location);
    return res.status(200).json(await weather.forecastSimple());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

router.get('/extended', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    weather.location(location);
    setSettingsFromQuery(req.query);

    return res.status(200).json(await weather.forecastExtended());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

router.get('/hourly', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);

    weather.location(location);
    setSettingsFromQuery(req.query);

    return res.status(200).json(await weather.forecastHourly());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});
router.get('/observation', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    weather.location(location);
    setSettingsFromQuery(req.query);
    return res.status(200).json(await weather.forecastObservation());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

router.get('/astronomy', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    weather.location(location);
    setSettingsFromQuery(req.query);

    return res.status(200).json(await weather.forecastAstronomy());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    weather.location(location);
    setSettingsFromQuery(req.query);
    return res.status(200).json(await weather.alerts());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});
router.get('/nwsalerts', async (req, res) => {
  try {
    const location = getLocationFromQuery(req.query);
    weather.location(location);
    setSettingsFromQuery(req.query);
    return res.status(200).json(await weather.nwsAlerts());
  } catch ({ data }) {
    return res.status(400).json({ data });
  }
});

module.exports = router;
