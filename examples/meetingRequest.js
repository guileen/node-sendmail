var icalToolkit = require('ical-toolkit')
var sendmail = require('../sendmail')({silent: true})

// Create a builder
var builder = icalToolkit.createIcsFileBuilder()

/*
 * Settings (All Default values shown below. It is optional to specify)
 * */
builder.spacers = true // Add space in ICS file, better human reading. Default: true
builder.NEWLINE_CHAR = '\r\n' // Newline char to use.
builder.throwError = false // If true throws errors, else returns error when you do .toString() to generate the file contents.
builder.ignoreTZIDMismatch = true // If TZID is invalid, ignore or not to ignore!

/**
 * Build ICS
 * */

// Name of calander 'X-WR-CALNAME' tag.
builder.calname = 'Yo Cal'

// Cal timezone 'X-WR-TIMEZONE' tag. Optional. We recommend it to be same as tzid.
builder.timezone = 'america/new_york'

// Time Zone ID. This will automatically add VTIMEZONE info.
builder.tzid = 'america/new_york'

// Method
builder.method = 'REQUEST'

// Add events
builder.events.push({

  // Event start time, Required: type Date()
  start: new Date(),

  // Event end time, Required: type Date()
  end: new Date(),

  // transp. Will add TRANSP:OPAQUE to block calendar.
  transp: 'OPAQUE',

  // Event summary, Required: type String
  summary: 'Test Event',

  // All Optionals Below

  // Alarms, array in minutes
  alarms: [15, 10, 5],

  // Optional: If you need to add some of your own tags
  additionalTags: {
    'SOMETAG': 'SOME VALUE'
  },

  // Event identifier, Optional, default auto generated
  uid: null,

  // Optional, The sequence number in update, Default: 0
  sequence: null,

  // Optional if repeating event
  repeating: {
    freq: 'DAILY',
    count: 10,
    interval: 10,
    until: new Date()
  },

  // Optional if all day event
  allDay: true,

  // Creation timestamp, Optional.
  stamp: new Date(),

  // Optional, floating time.
  floating: false,

  // Location of event, optional.
  location: 'Home',

  // Optional description of event.
  description: 'Testing it!',

  // Optional Organizer info
  organizer: {
    name: 'Jason Humphrey',
    email: 'jason@yourdomain.com',
    sentBy: 'person_acting_on_behalf_of_organizer@email.com' // OPTIONAL email address of the person who is acting on behalf of organizer.
  },

  // Optional attendees info
  attendees: [
    {
      name: 'A1', // Required
      email: 'a1@email.com', // Required
      status: 'TENTATIVE', // Optional
      role: 'REQ-PARTICIPANT', // Optional
      rsvp: true // Optional, adds 'RSVP=TRUE' , tells the application that organiser needs a RSVP response.
    },
    {
      name: 'A2',
      email: 'a2@email.com'
    }
  ],

  // What to do on addition
  method: 'PUBLISH',

  // Status of event
  status: 'CONFIRMED',

  // Url for event on core application, Optional.
  url: 'http://google.com'
})

// Optional tags on VCALENDAR level if you intent to add. Optional field
builder.additionalTags = {
  'SOMETAG': 'SOME VALUE'
}

// Try to build
var icsFileContent = builder.toString()

// Check if there was an error (Only required if yu configured to return error, else error will be thrown.)
if (icsFileContent instanceof Error) {
  console.log('Returned Error, you can also configure to throw errors!')
  // handle error
}

sendmail({
  from: 'test@yourdomain.com',
  to: 'info@yourdomain.com',
  replyTo: 'jason@yourdomain.com',
  subject: 'MailComposer sendmail',
  html: 'Mail of test sendmail ',
  alternatives: [{
    contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
    content: icsFileContent.toString()
  }]
}, function (err, reply) {
  console.log(err && err.stack)
  console.dir(reply)
})

