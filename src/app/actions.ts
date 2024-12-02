'use server'
import fs from 'fs';


export async function getReport() {
    // Get the data from the JSON files
    const data = await fs.promises.readFile('src/data/report.json', 'utf-8');
    const jsonData = JSON.parse(data);

    const paragraphs = jsonData.metadata.paragraphs;
  
    const entities = jsonData.entities;

    const relations = jsonData.relationships;

    return { paragraphs, entities, relations };
}


export async function getAllEntities() {
    // Get the data from the JSON files
    const data = await fs.promises.readFile('src/data/entities.json', 'utf-8');
    const jsonData = JSON.parse(data);

    const entities = jsonData.objects.domain;
    entities.map((entity, index) => {
        entities[index] = entity.name;
    }
    );

    return entities;
}

export async function getAllRelations() {
    // Get the data from the JSON files
    const data = await fs.promises.readFile('src/data/entities.json', 'utf-8');
    const jsonData = JSON.parse(data);

    const relations = jsonData.relationships;

    return relations;
}
