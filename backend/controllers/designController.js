import Design from '../models/Design.js';
const dummyUserId = '661b1a9c1e2f3d4a5b6c7d8e';
export const getDesigns = async (req, res) => {
  try {
    // Look up designs using the dummy ID instead of req.user._id
    const designs = await Design.find({ user: dummyUserId }).sort({ updatedAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    console.error("Fetch Designs Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getDesignById = async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) return res.status(404).json({ message: 'Design not found' });
  if (design.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
  res.status(200).json(design);
};

export const createDesign = async (req, res) => {
  const { title, canvasData, thumbnailUrl } = req.body;

  try {
    const design = await Design.create({
      title: title || 'Newresolutionstudio Project',
      canvasData: canvasData || {},
      thumbnailUrl: thumbnailUrl || '',
      // THE FIX: Use the dummy ID here!
      user: dummyUserId, 
    });

    res.status(201).json(design);
  } catch (error) {
    console.error("Create Design Error:", error);
    res.status(500).json({ message: 'Failed to create design' });
  }
};

export const updateDesign = async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) return res.status(404).json({ message: 'Design not found' });
  if (design.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  const updatedDesign = await Design.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedDesign);
};

export const deleteDesign = async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) return res.status(404).json({ message: 'Design not found' });
  if (design.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

  await design.deleteOne();
  res.status(200).json({ id: req.params.id });
};