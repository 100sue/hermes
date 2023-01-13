const express = require('express');
const app = require('express');
const cors = require ('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const { Configuration, OpenAIApi } = require ('openai');
const configuration = new configuration({ apikey:'sk...'})
const openai = new OpenAIApi(configuration);

const AWS = require('aws-sdk');
AWS.config.loadFromPath("awsCreds.json")