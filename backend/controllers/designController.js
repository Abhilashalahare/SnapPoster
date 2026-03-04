import Design from '../models/Design.js';


export const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error("Fetch Designs Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

   
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this poster' });
    }

    res.status(200).json(design);
  } catch (error) {
    console.error("Get Design By ID Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const createDesign = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No data payload received.' });
  }

  const { title, canvasData, thumbnailUrl } = req.body;

  try {
    const design = await Design.create({
      title: title || 'SnapPoster Project',
      canvasData: canvasData || {},
      thumbnailUrl: thumbnailUrl || '',
      user: req.user._id, 
    });

    res.status(201).json(design);
  } catch (error) {
    console.error("Create Design Error:", error);
    res.status(500).json({ message: 'Failed to create design' });
  }
};


export const updateDesign = async (req, res) => {
  const { title, canvasData, thumbnailUrl } = req.body;

  try {
    let design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

   
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this poster' });
    }

    design.title = title || design.title;
    design.canvasData = canvasData || design.canvasData;
    if (thumbnailUrl) design.thumbnailUrl = thumbnailUrl;

    const updatedDesign = await design.save();
    res.status(200).json(updatedDesign);
  } catch (error) {
    console.error("Update Design Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    
    if (design.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this poster' });
    }

    await design.deleteOne(); 

    res.status(200).json({ message: 'Design removed successfully' });
  } catch (error) {
    console.error("Delete Design Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};