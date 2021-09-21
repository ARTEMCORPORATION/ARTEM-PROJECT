// controlador-post.js

const { validationResult } = require('express-validator');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Usuario = require('../models/usuario');

const recuperaPosts = async (req, res, next) => {
	console.log('En recuperaPost');

	post = await Post.find();
	console.log(post);
	try {
		post = await Post.find();
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos'
		);
		error.code = 500;
		return next(error);
	}
	if (!post) {
		const error = new Error(
			'No se ha podido encontrar un destino con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}
	res.json({
		post: post,
	});
};

const recuperaPostPorId = async (req, res, next) => {
	const idPost = req.params.did; // { did = 1 }
	let post;
	try {
		post = await Post.findById(idPost);
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos'
		);
		error.code = 500;
		return next(error);
	}
	if (!post) {
		const error = new Error(
			'No se ha podido encontrar un destino con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}
	res.json({
		nombre: post,
	});
};

const recuperaPostPorIdUsuario = async (req, res, next) => {
	const idPost = req.params.uid;
	let post;
	try {
		posts = await Post.find({
			creador: idUsuario,
		});
	} catch (err) {
		const error = new Error(
			'Ha fallado la recuperación. Inténtelo de nuevo más tarde'
		);
		error.code = 500;
		return next(error);
	}

	if (!posts || posts.length === 0) {
		const error = new Error(
			'No se han podido encontrar posts para el usuario proporcionado'
		);
		error.code = 404;
		return next(error);
	} else {
		res.json({
			posts,
		});
	}
};

const crearPost = async (req, res, next) => {
	console.log('En nuevoPost');
	const errores = validationResult(req); // Valida en base a las especificaciones en el archivo de rutas para este controller específico
	if (!errores.isEmpty()) {
		const error = new Error('Error de validación. Compruebe sus datos');
		error.code = 422;
		return next(error);
	}
	const { nombre, opinion, pros, contras,recomendacion, valoracion ,preciocalidad, creador } = req.body;
	const nuevoPost = new Post({
		nombre,
		opinion,
		recomendacion,
        creador
	});
	console.log(nuevoPost);

	let usuario; // Localizamos al usuario que se corresponde con el creador que hemos recibido en el request
	try {
		usuario = await Usuario.findById(creador);
	} catch (error) {
		const err = new Error('Ha fallado la creación del post');
		err.code = 500;
		return next(err);
	}

	if (!usuario) {
		const error = new Error(
			'No se ha podido encontrar un usuario con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await nuevoPost.save({
			session: sess,
		});
		usuario.posts.push(nuevoPost);
		await usuario.save({
			session: sess,
		});
		await sess.commitTransaction();
	} catch (error) {
		const err = new Error('No se han podido guardar los datos');
		err.code = 500;
		return next(err);
	}
	res.status(201).json({
		post: nuevoPost,
	});
};

const modificarPost = async (req, res, next) => {
	const { opinion, valoracion } = req.body;
	const idPost = req.params.did;
	let post;
	try {
		post = await Post.findById(idPost);
	} catch (error) {
		const err = new Error(
			'Ha habido algún problema. No se ha podido actualizar la información del post'
		);
		err.code = 500;
		return next(err);
	}

	if (post.creador.toString() !== req.userData.userId) {
		const err = new Error('No tiene permiso para modificar este post');
		err.code = 401; // Error de autorización
		return next(err);
	}

	post.opinion = opinion;
	post.recomendacion = recomendacion;

	try {
		post.save();
	} catch (error) {
		const err = new Error(
			'Ha habido algún problema. No se ha podido guardar la información actualizada'
		);
		err.code = 500;
		return next(err);
	}

	res.status(200).json({
		post,
	});
};

const eliminarPost = async (req, res, next) => {
	const idPost = req.params.did;
	let post;
	try {
		post = await Post.findById(idPost).populate('creador');
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido recuperar los datos para eliminación'
		);
		error.code = 500;
		return next(error);
	}

	if (!post) {
		const error = new Error(
			'No se ha podido encontrar un post con el id proporcionado'
		);
		error.code = 404;
		return next(error);
	}

	if (post.creador.id !== req.userData.userId) {
		const err = new Error('No tiene permiso para eliminar este post');
		err.code = 401; // Error de autorización
		return next(err);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await post.remove({
			session: sess,
		});
		post.creador.posts.pull(post);
		await post.creador.save({
			session: sess,
		});
		await sess.commitTransaction();
	} catch (err) {
		const error = new Error(
			'Ha habido algún error. No se han podido eliminar los datos'
		);
		error.code = 500;
		return next(error);
	}
	res.json({
		message: 'Post eliminado',
	});
};

exports.recuperaPostPorId = recuperaPostPorId;
exports.recuperaPostPorIdUsuario = recuperaPostPorIdUsuario;
exports.crearPost = crearPost;
exports.recuperaPosts = recuperaPosts;
exports.modificarPost = modificarPost;
exports.eliminarPost = eliminarPost;
