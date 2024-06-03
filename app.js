const annotation = {
    "openapi": "3.1.0",
    "info": {
        "title": "Sensor Data API",
        "version": "1.0.0",
        "description": "RESTful API for handling sensor data"
    },
    "servers": [{
            "url": "http://localhost:5039",
            "description": "Local server"
        },
        {
            "url": "https://elecync.onrender.com",
            "description": "Live server"
        }
    ],
    "paths": {
        "/data": {
            "get": {
                "tags": ["DATA"],
                "summary": "Get all data",
                "responses": {
                    "200": {
                        "description": "List of data",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Data"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                }
            },
            "post": {
                "tags": ["DATA"],
                "summary": "Add new data",
                "requestBody": {
                    "description": "Data object that needs to be added to the storage array",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Data"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Data added successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Data"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Data": {
                "type": "object",
                "properties": {
                    "voltage": {
                        "type": "string",
                        "example": "0.0"
                    },
                    "current": {
                        "type": "string",
                        "example": "0.0"
                    },
                    "power": {
                        "type": "string",
                        "example": "0.0"
                    },
                    "energy": {
                        "type": "string",
                        "example": "0.0"
                    },
                    "frequency": {
                        "type": "string",
                        "example": "0.0"
                    },
                    "pf": {
                        "type": "string",
                        "example": "0.00"
                    }
                }
            }
        }
    }
};

module.exports = annotation;
