import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ni
im=Image.open('raw/1776501672174_2HP_50L_Silent_Air_Compressor_.png.png').convert('RGB');a=np.asarray(im).astype(int)
cand=(a.min(2)>=232)&((a.max(2)-a.min(2))<14)
lab,n=ni.label(cand);e=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
fg=~np.isin(lab,list(e));fg=ni.binary_opening(fg,iterations=1)
l2,n2=ni.label(fg);s=ni.sum(fg,l2,range(1,n2+1));fg=np.isin(l2,[i+1 for i,v in enumerate(s) if v>0.004*fg.size])
fg=ni.binary_fill_holes(fg)
H,W=cand.shape
for i,sl in enumerate(ni.find_objects(lab)):
    if i+1 in e: continue
    area=(lab[sl]==i+1).sum()
    if area<150: continue
    cy=(sl[0].start+sl[0].stop)/2/H; cx=(sl[1].start+sl[1].stop)/2/W
    print(round(cx,2),round(cy,2),area)
    if (cx<0.42 and cy<0.62) or (0.42<cx<0.8 and (cy<0.2 or 0.42<cy<0.56) and area>400):
        fg[lab==i+1]=False; print('  cleared')
al=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
o=im.convert('RGBA');o.putalpha(al);o=o.crop(o.getbbox());o.save('web/compressor-2hp.webp',quality=86,method=6)
t=Image.new('RGB',o.size,(24,26,31));t.paste(o,(0,0),o);t.thumbnail((620,620));t.save('chk.png')
