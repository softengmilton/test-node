const home = async (req, res) => {
    try {
        res.status(200).send('Home Page');  
    } catch (error) {
        console.log(error);
    }
}


module.exports = { home };