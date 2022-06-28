
export default function svgpath(d) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  node.setAttributeNS(null, 'd', d);

  const getTotalLength = () => {
    if (node && node.getTotalLength) {
      return node.getTotalLength();
    }
  };

  const getPointAtLength = (length) => {
    if (node && node.getPointAtLength) {
      return node.getPointAtLength(length);
    }
  };

  return {
    getTotalLength,
    getPointAtLength,
  };
}
