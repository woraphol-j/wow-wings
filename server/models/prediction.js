const AWS = require('aws-sdk');
const logger = require('winston');

module.exports = (Prediction) => {
  const runInstance = async () => {
    try {
      const ec2 = new AWS.EC2({
        apiVersion: '2016-11-15',
        region: 'ap-southeast-1',
      });

      let params = {
        ImageId: 'ami-10fd7020', // amzn-ami-2011.09.1.x86_64-ebs
        InstanceType: 't2.nano',
        MinCount: 1,
        MaxCount: 1,
      };

      // Create the instance
      const ec2Instance = await ec2.runInstances(params);
      const instanceId = ec2Instance.Instances[0].InstanceId;
      logger.info('Created instance', instanceId);
      // Add tags to the instance
      params = {
        Resources: [instanceId],
        Tags: [
          {
            Key: 'Name',
            Value: 'SDK Sample',
          },
        ],
      };
      await ec2.createTags(params);
    } catch (err) {
      logger.info(err);
    }
  };

  Prediction.submit = async (data, cb) => {
    const ml = new AWS.MachineLearning({
      apiVersion: '2014-12-12',
      region: 'eu-west-1',
    });

    try {
      // const dsParams = {
      //   DataSourceId: 'ds-iWk7eQL1sMX',
      //   Verbose: true || false,
      // };
      // const mlDatasource = await ml.getDataSource(dsParams);
      // const params = {
      //   MLModelId: 'ml-xBhKX4izWiw_dfdfdfs', /* required */
      //   Verbose: true || false,
      // };
      // const mlModel = await ml.getMLModel(params);
      // cb(null, {
      //   currentState: mlModel,
      // });
      runInstance();
    } catch (err) {
      cb(err);
      logger.info(err);
    }
  };
  const submit = {
    description: 'Submit the prediction to the system',
    accepts: [{
      arg: 'request',
      description: 'Model instance data',
      type: 'string',
      default: `
          {
            "name": "bank",
            "score": 40
          }
          `,
    }],
    http: {
      path: '/submit',
      verb: 'get',
    },
    returns: {
      arg: 'data',
      type: 'object',
    },
  };
  Prediction.remoteMethod('submit', submit);
};
