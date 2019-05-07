const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const EventsService = require('./events-service');
const eventsRouter = express.Router();
const jsonBodyParser = express.json();

eventsRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    /*
    // This try block checks to see if a user has events in the
    // database. If there are none, it sends a 404.
    */
    try{
      const event = await EventsService.getAllUserEvents(
        req.app.get('db'),
        req.user.id
      );

      if(!event){
        return res.status(404).json({
          error: `You don't have any events.`
        })
      }
      req.event = event;
      next();
    } catch(error){
      next(error);
    }
  })

// display all of a user's events
// eventsRouter
//   .get('/', async (req, res, next) => {
//     try {
//       const event = await EventsService.getAllUserEvents(
//         req.app.get('db'),
//         req.user.id
//       );
//       res.json({
//         event
//       })
//       next()
//     } catch(error){
//       next(error)
//     }
//   });

// post a new event to the database
eventsRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const {name, date, tag, calories, protein, fat, carbs } = req.body;
    const fields = ['name'];

    for (const field of fields) {
        if (!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            });
    }

    const user_id = req.user.id;
    EventsService.insertEvent(
      req.app.get('db'),
      { user_id,
        name,
        date,
        tag,
        calories,
        protein,
        fat,
        carbs
        }
    )
      .then(event => {
        res.status(201).json(event)
      })
      .catch(next)
  });

// delete an event (by id) from the database
eventsRouter
  .delete('/', jsonBodyParser, async (req, res, next) => {
    const { event } = req.body;
    const delEvent = event;

    EventsService.deleteEvent(
      req.app.get('db'),
      delEvent
    )
      .then(event => {
        res.status(200).json(delEvent)
      })
      .catch(next);
  });

// get only one event by id
eventsRouter
  .get('/:eventId', jsonBodyParser, (req, res, next) => {
    EventsService.getSingleUserEvent(
      req.app.get('db'),
      req.user.id,
      Number(req.params.eventId)
    )
      .then(event => {
        if(event.length === 0) {
          return res.status(404).json({
            error: { message : 'Event not found'}
          });
        }
        res.status(200).json(event);
      })
      .catch(next);
  });

//get events inside a range of dates
eventsRouter
  .post('/date', jsonBodyParser, (req, res, next) => {
      const { start, end } = req.body
      const fields = ['start', 'end'];

      for (const field of fields) {
          if (!req.body[field])
              return res.status(400).json({
                  error: `Missing '${field}' in request body`
              });
      }

      EventsService.getUserEventByDate(
          req.app.get('db'),
          req.user.id,
          //need to discuss format of date
          start,
          end
      )
      .then(events => {
          if(!events[0]) {
              return res.status(404).json({
            error: { message : 'No events found in that date range'}
          });
          }
          res.status(200).json(events);
      })
      .catch(next);
  })

module.exports = eventsRouter;