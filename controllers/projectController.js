const fs = require('fs');
const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {

    try {
        const projects = await Project.find().sort('-dateCreated');
        
        res.status(200).render('index', {
            page_name:'index',
            projects: projects
        });

    } catch (err) {
        console.error(err)
        res.status(400).json({
            status: 'failed'
        });
    }
};

exports.createProject = async (req, res) => {
    
    try {

        const uploadDir = 'public/uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // When an image for project hasn't selected.
        const defaultImagePath = __dirname + '/../public/assets/img/default-unsplash.jpg';
        let uploadPath =  __dirname + '/../public/uploads/';
        let imagePath = '';

        if(req.files){
            uploadPath += req.files.image.name;
            imagePath = '/uploads/'+req.files.image.name;
        }
        else {
            uploadPath += 'default-unsplash.jpg';
            imagePath = '/uploads/default-unsplash.jpg';

            fs.copyFile(defaultImagePath, uploadPath, (err) => {
                if (err) throw err;
                console.log('Default image copied.');
            })
        }
    

        if(req.files){
            await req.files.image.mv(uploadPath);
        }

        const project = await Project.create({
            name: req.body.name,
            subtitle: req.body.subtitle,
            description: req.body.description,
            client: req.body.client,
            category: req.body.category,
            image: imagePath
        });

        res.status(201).redirect('/#portfolio');

    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'failed'
        });
    }

    
};

exports.updateProject = async (req, res) => {
    
    try {

        const uploadDir = 'public/uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        let uploadPath =  __dirname + '/../public/uploads/';
        let imagePath = '';

        if(req.files){
            uploadPath += req.files.image.name;
            imagePath = '/uploads/'+req.files.image.name;
        }
        
        const project = await Project.findById(req.params.id);

        project.name= req.body.name;
        project.subtitle= req.body.subtitle;
        project.description= req.body.description;
        project.client= req.body.client;
        project.category= req.body.category;
        if(req.files){
            project.image= imagePath;
            await req.files.image.mv(uploadPath);
        }

        await project.save();

        res.status(200).redirect('/#portfolio');

    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'failed'
        });
    }

    
};

exports.deleteProject = async (req, res) => {

    try {
        const project = await Project.findById(req.params.id);
        let filePath = __dirname + '/../public' + project.image;

        fs.unlinkSync(filePath);

        await Project.findByIdAndDelete(req.params.id);
        res.status(200).redirect('/#portfolio');
        
    } catch (err) {
        console.err(err);
        res.status(400).json({
            status: 'failed'
        });
    }

};