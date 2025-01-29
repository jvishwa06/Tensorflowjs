import * as tf from '@tensorflow/tfjs';

async function loadDataset() {
    const mnist = await tf.data.mnist();
    const dataset = mnist.nextTrainBatch(5000); 
    const images = dataset.xs.reshape([5000, 28, 28, 1]); 
    const labels = dataset.labels; 
    return { images, labels };
}


function createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' })); 

    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    return model;
}


async function trainModel() {
    const { images, labels } = await loadDataset();
    const model = createModel();

    console.log("Training...");
    await model.fit(images, labels, {
        epochs: 10,
        batchSize: 32
    });

    console.log("Training Complete.");
    
    await model.save('downloads://mnist-model');
}

trainModel();

