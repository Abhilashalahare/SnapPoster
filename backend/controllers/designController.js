import Design from '../models/Design.js';

export const getDesigns = async (req, res) => {
  const designs = await Design.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.status(200).json(designs);
};

export const getDesignById = async (req, res) => {
  const design = await Design.findById(req.params.id);
  if (!design) return res.status(404).json({ message: 'Design not found' });
  if (design.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
  res.status(200).json(design);
};

export const createDesign = async (req, res) => {
  const { title, canvasData, thumbnailUrl } = req.body;
  const design = await Design.create({
    title: title || 'Untitled Design',
    canvasData: canvasData || {},
    thumbnailUrl: thumbnailUrl || '',
    user: req.user.id,
  });
  res.status(201).json(design);
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