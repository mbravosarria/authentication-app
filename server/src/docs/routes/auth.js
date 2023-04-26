/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login User
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Logged Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Incorrect email or user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Register User
 * /api/auth/register:
 *   post:
 *     summary: Register User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Register User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login Google User
 * /api/auth/google:
 *   get:
 *     summary: Login Google User
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged Successfully
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login Github User
 * /api/auth/github:
 *   get:
 *     summary: Login Github User
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged Successfully
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Get Logged In User
 * /api/auth/logged-user:
 *   get:
 *     summary: Get Logged In User
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged In User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: No User Logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Signout User
 * /api/auth/logout:
 *   get:
 *     summary: Signout User
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Signout User
 *       500:
 *         description: Some server error
 *
 */
