
# API Design
## Institution management
**security policy**: User has to be admin
### Add institution
**POST** `/api/institutions`

**expects**:
```js
body: {
   name: String,
   location: {
      lat: Number,
      long: Number,
   }
}
```

### Fetch institutions
**GET** `/api/institutions`

**returns**:
```js
body: [
   {
      id: Number,
      name: String,
      location: Object,
   },
   ...
]
```

### Update institution
**PATCH** `/api/institutions/:id`
To be design when necessary

### Delete institution
**DELETE** `/api/institutions/:id`

<hr>

## Clerk management
**security policy**: User has to be admin

### Add clerk
**POST** `/api/clerks`

**expects**:
```js
body: {
   name: String,
   surname: String,
   email: String,
   password: String,
   institution: Number,
}
```

### Fetch clecks
**GET** `/api/clerks`

**returns**:
```js
body: [
   {
      id: Number,
      name: String,
      surname: String,
      email: String,
      institution: {
         id: Number,
         name: String,
      }
   },
   ...
]
```



### Update clerk
**PATCH** `/api/clerks/:id`
To be design when necessary

### Delete clerk
**DELETE** `/api/clerks/:id`

<hr>

## Resource Type Management
**security policy**: User has to be admin

### Add resource type
**POST** `/api/resource-types`

**expects**:
```js
body: {
   name: String,
}
```

### Fetch resource types
**GET** `/api/resource-types`

**returns**:
```js
body: [
   {
      id: Number,
      name: String,
   },
   ...
]
```

<hr>


### Update resource type
**PATCH** `/api/resource-types/:id`
To be design when necessary

### Delete resource type
**DLETE** `/api/resource-types/:id`

<hr>

## Resource management
**security policy**: User has to be clerk

### Add resource
**POST** `/api/resources`

**expects**:
```js
body: {
   name: String,
   resource_type: Number,
}
```

### Fetch resources
**GET** `/api/resources`

**returns**:
```js
body: [
   {
      id: Number,
      name: String,
      resource_type: {
         id: Number,
         name: String,
      }
   },
   ...
]
```


### Update resource
**PATCH** `/api/resources/:id`
To be design when necessary


### Delete resource
**PATCH** `/api/resources/:id`

<hr>

## Booking
**security policy**: User has to be clerk

### Check available slots
**GET** `/api/bookings/free-slots`

**expects**: 
```js
url: {
   duration: Number, // the number of microseconds the booking requires
   resource_types: String, // comma-delimited resource types,
   earliest: String, // the earliest the booking is required
}
```

**returns**:
```js
body: [
   {
      id: Number,
      name: String,
      location: Object,
      available_at: Number,
      resources: [
         {
            id: Number,
            name: String,
         },
         ...
      ]
   },
   ...
] // instituitions
```

### Book resources
**POST** `/api/bookings`

**expects**:
```js
body: {
   book_on: Number,
   duration: Number,
   from: Number,
   resources: [ Number, ... ]
}
```

### Fetch bookings
**GET** `/api/bookings`

**returns**:
```js
body: [
   {
      id: Number,
      from: Date,
      to: Date
      booked_on: {
         id: Number,
         name: String,
      },
      resources: [
         {
            id: Number,
            name: String,
         },
         ...
      ]
   },
   ...
]
```

### Cancel bookings
**DELETE** `/api/bookings/:id`

<hr>