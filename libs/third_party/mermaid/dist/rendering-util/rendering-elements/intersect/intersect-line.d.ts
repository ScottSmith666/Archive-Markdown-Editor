export default intersectLine;
/**
 * Returns the point at which two lines, p and q, intersect or returns undefined if they do not intersect.
 */
declare function intersectLine(p1: any, p2: any, q1: any, q2: any): {
    x: number;
    y: number;
} | undefined;
