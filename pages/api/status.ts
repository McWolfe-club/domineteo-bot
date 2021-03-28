// API for dom bot to check status for snek erth game

export default (req, res) => {
    res.status(200).json({ 
        type: 4,
        data: {
            tts: false,
            content: 'Test',
        }
     })
}
