type Point = {
    x: number;
    y: number;
};
export {Point}

type Circle = {
    x: number;
    y: number;
    r: number;
};
export {Circle}

function radiusFromFWI(FWI: number): number{
    if(typeof(FWI) == "undefined"){
        return 10000;
    }
    return Math.exp(-0.08*FWI + 3);
    // return (-11.242 * FWI) + 101.88;
}
export {radiusFromFWI}

function euclideanDistance(p1: Point, p2: Point){
    return Math.sqrt((p1.x -p2.x)**2 + (p1.y - p2.y)**2);
}


function getIntersection2Circles(circle1: Circle, circle2: Circle): Array<Point> | null {
    const d = euclideanDistance({x: circle1.x, y: circle1.y}, {x: circle2.x, y: circle2.y});

    // non-intersecting
    if (d > circle1.r + circle2.r) {
        return null;
    }
    // one circle within other
    if (d < Math.abs(circle1.r - circle2.r)) {
        return null;
    }
    // coincident circles
    if (d === 0 && circle1.r === circle2.r) {
        return null;
    }

    const a = (circle1.r**2 - circle2.r**2 + d**2) / (2*d);
    const h = Math.sqrt(circle1.r**2 - a**2);
    const x2 = circle1.x + a * (circle2.x - circle1.x) / d;
    const y2 = circle1.y + a * (circle2.y - circle1.y) / d;
    const x3 = x2 + h * (circle2.y - circle1.y) / d;
    const y3 = y2 - h * (circle2.x - circle1.x) / d;
    const x4 = x2 - h * (circle2.y - circle1.y) / d;
    const y4 = y2 + h * (circle2.x - circle1.x) / d;

    const point1: Point = {x: x3, y: y3};
    const point2: Point = {x: x4, y: y4};

    return [point1, point2];
}

function numberOfIntersections(circle1: Circle, circle2: Circle): number {
    const v = getIntersection2Circles(circle1, circle2);
    if (v === null) {
      return 0;
    } else {
      return v.length;
    }
}
  
function containment2Circles(circle1: Circle, circle2: Circle): number {
    const d = Math.sqrt((circle2.x - circle1.x) ** 2 + (circle2.y - circle1.y) ** 2);
    const numOfIntersections = numberOfIntersections(circle1, circle2);
    if (d < Math.abs(circle1.r - circle2.r) && circle1.r < circle2.r && numOfIntersections === 0) {
        return 1;
    } else {
        return 0;
    }
}
  
function pointInCircle(point: Point, circle: Circle): number {
    if ((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2 < circle.r ** 2) {
        return 1;
    } else {
        return 0;
    }
}

function determineOverlapCase_intermediate(circle1: Circle, circle2: Circle, circle3: Circle): number {
    // check containment conditions:
    const _1_containedIn_2 = containment2Circles(circle1, circle2);
    const _1_containedIn_3 = containment2Circles(circle1, circle3);
    const _2_containedIn_1 = containment2Circles(circle2, circle1);
    const _2_containedIn_3 = containment2Circles(circle2, circle3);
    const _3_containedIn_1 = containment2Circles(circle3, circle1);
    const _3_containedIn_2 = containment2Circles(circle3, circle2);

    // check intersection numbers:
    const intersections_between_1and2 = numberOfIntersections(circle1, circle2);
    const intersections_between_1and3 = numberOfIntersections(circle1, circle3);
    const intersections_between_2and3 = numberOfIntersections(circle2, circle3);

    const conditions = [_1_containedIn_2, _1_containedIn_3, _2_containedIn_1, _2_containedIn_3, _3_containedIn_1, _3_containedIn_2, intersections_between_1and2, intersections_between_1and3, intersections_between_2and3];

    // match condition to case: (using if-else statements instead of dictionary but maybe use hashmap when translating to js)
    let Case = 0;
    if (conditions.join('') === '000000000') {
        Case = 1;
    } else if (conditions.join('') === '000000020') {
        Case = 2;
    } else if (conditions.join('') === '100000000') {
        Case = 3;
    } else if (conditions.join('') === '110100000') {
        Case = 4;
    } else if (conditions.join('') === '010100020') {
        Case = 5;
    } else if (conditions.join('') === '010100000') {
        Case = 6;
    } else if (conditions.join('') === '000000002') {
        Case = 7;
    } else if (conditions.join('') === '000000222') {
        // Differentiate between cases 8,9,13 and 14:
        // .................
        // Case 8: one of the intersection points between 2 circles is contained within the third circle
        // Case 9: none of the intersection points between 2 circles is contained within the third circle
        // Case 13: intersections between 1 and 2 both contained within 3 and intersections between 1 and 3 both contained within 2 
        // but intersections between 2 and 3 not contained within 1
        // Case 14: Case 9 but intersections between 1 and 3 contained within 2
        // .................

        const intersections_1and2 = getIntersection2Circles(circle1, circle2);
        const intersections_1and3 = getIntersection2Circles(circle1, circle3);
        const intersections_2and3 = getIntersection2Circles(circle2, circle3);

        if (pointInCircle(intersections_1and2[0], circle3) === 0 &&
            pointInCircle(intersections_1and2[1], circle3) === 0 &&
            pointInCircle(intersections_2and3[0], circle1) === 0 &&
            pointInCircle(intersections_2and3[1], circle1) === 0){
            if (pointInCircle(intersections_1and3[0], circle2) === 0 &&
                pointInCircle(intersections_1and3[1], circle2) === 0){
                    Case = 9;
            }
            else{
                Case = 14;
            }
        }
        else if(pointInCircle(intersections_1and2[0], circle3) === 1 &&
                pointInCircle(intersections_1and2[1], circle3) === 1 &&
                pointInCircle(intersections_1and3[0], circle2) === 1 &&
                pointInCircle(intersections_1and3[1], circle2) === 1 &&
                pointInCircle(intersections_2and3[0], circle1) === 0 &&
                pointInCircle(intersections_2and3[1], circle1) === 0){
                    Case = 13;
        }
        else{
            Case = 8;
        }
    }
    else if(conditions.join('') === '100000002'){
        Case = 10;
    }
    else if(conditions.join('') === '100000022'){
        Case = 11;
    }
    else if(conditions.join('') === '110000002'){
        Case = 12;
    }
    else{
        Case = 0;
    }

    return Case;
}

function determineOverlapCase(circle1: Circle, circle2: Circle, circle3: Circle): [number, number] {
    // Cycle through 6 possible argument combinations to get a conclusive output
    let Case = determineOverlapCase_intermediate(circle1, circle2, circle3);
    let circle_config = 1;

    if (Case == 0 || Case == 8) {  // Case 8 is inconclusive and can lead to Case 13 not being determined properly so need to iterate 
                                  // (Case 13 can satisfy the conditions for Case 8 in up to 4 configurations...)
        Case = determineOverlapCase_intermediate(circle1, circle3, circle2);
        circle_config = 2;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle2, circle1, circle3);
        circle_config = 3;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle3, circle1, circle2);
        circle_config = 4;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle2, circle3, circle1);
        circle_config = 5;
    }
    if (Case == 0 || Case == 8) {
        Case = determineOverlapCase_intermediate(circle3, circle2, circle1);
        circle_config = 6;
    }

    return [Case, circle_config];
}
export {determineOverlapCase};

function area_circle(circle: Circle): number {
    const A = Math.PI * Math.pow(circle.r, 2);
    return A;
}
  
function area_overlap_2circles(circle1: Circle, circle2: Circle): number {
    const intersections = getIntersection2Circles(circle1, circle2);
  
    const d = euclideanDistance(intersections[0], intersections[1]);
  
    // area of segment 1
    const r1 = circle1.r;
    const theta1 = Math.acos((2 * Math.pow(r1, 2) - Math.pow(d, 2)) / (2 * Math.pow(r1, 2)));
  
    const a_sect1 = (theta1 / (2 * Math.PI)) * Math.PI * Math.pow(r1, 2);
    const a_tri1 = 0.5 * Math.pow(r1, 2) * Math.sin(theta1);
  
    const a_seg1 = a_sect1 - a_tri1;
  
    // area of segment 2
    const r2 = circle2.r;
    const theta2 = Math.acos((2 * Math.pow(r2, 2) - Math.pow(d, 2)) / (2 * Math.pow(r2, 2)));
  
    const a_sect2 = (theta2 / (2 * Math.PI)) * Math.PI * Math.pow(r2, 2);
    const a_tri2 = 0.5 * Math.pow(r2, 2) * Math.sin(theta2);
  
    const a_seg2 = a_sect2 - a_tri2;
  
    return a_seg1 + a_seg2;
}
  
 
// Area of circle:

  
function areas_case1(circle1: Circle, circle2: Circle, circle3: Circle): number[][] {
    // total area (all green) is just the total area of the 3 circles:
    const A1 = area_circle(circle1);
    const A2 = area_circle(circle2);
    const A3 = area_circle(circle3);
  
    return [[A1, A2, A3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];
}
  
function areas_case2(circle1: Circle, circle2: Circle, circle3: Circle): number[][] {
    // calculate yellow overlapping areas first then calculate green areas accordingly
    const yellow_1and2 = area_overlap_2circles(circle1, circle2);
    const yellow_1and3 = area_overlap_2circles(circle2, circle3);
  
    let green1 = area_circle(circle1);
    green1 -= yellow_1and2;
    let green2 = area_circle(circle2);
    green2 -= yellow_1and2 + yellow_1and3;
    let green3 = area_circle(circle3);
    green3 -= yellow_1and3;
  
    const total_yellow = yellow_1and2 + yellow_1and3;
    const total_green = green1 + green2 + green3;
    
    return [[green1, green2, green3, 0],
            [yellow_1and2, yellow_1and3, 0, 0],
            [0, 0, 0, 0]];
}

//Case 3:
function areas_case3(circle1: Circle, circle2: Circle, circle3: Circle) {
    const yellow = area_circle(circle1);
  
    let green1 = area_circle(circle2);
    green1 -= yellow;
    const green2 = area_circle(circle3);
  
    return [
      [0, green1, green2, 0],
      [yellow, 0, 0, 0],
      [0, 0, 0, 0]
    ];
}

//Case 4:
function areas_case4(circle1: Circle, circle2: Circle, circle3: Circle) {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);
  
    const red = a1;
    const yellow = a2 - a1;
    const green = a3 - a2;
  
    return [
      [0, 0, green, 0],
      [0, yellow, 0, 0],
      [red, 0, 0, 0]
    ];
}

// Case 5
function areas_case5(circle1: Circle, circle2: Circle, circle3: Circle): number[][] {
    const red: number = area_overlap_2circles(circle1, circle2);
    const a1: number = area_circle(circle1);
    const a2: number = area_circle(circle2);
    const yellow1: number = a1 - red;
    const yellow2: number = a2 - red;
    let green: number = area_circle(circle3) - yellow1 - yellow2 - red;
  
    return [
      [0, 0, green, 0],
      [0, yellow2, yellow1, 0],
      [red, 0, 0, 0]
    ];
}

// Case 6
function areas_case6(circle1: Circle, circle2: Circle, circle3: Circle): number[][]{
    const a1:number = area_circle(circle1);
    const a2: number = area_circle(circle2);
    
    const green: number = area_circle(circle3) - a1 -a2;
    
    return [
        [0, 0, green, 0],
        [0, a2, a1, 0],
        [0, 0, 0, 0]
    ]
}

// Case 7
function areas_case7(circle1: Circle, circle2: Circle, circle3: Circle): number[][]{
    const yellow: number = area_overlap_2circles(circle2, circle3);

    const a1:number = area_circle(circle1);
    const a2: number = area_circle(circle2) - yellow;
    const a3: number = area_circle(circle3) - yellow;

    return [
        [a1, a2, a3, 0],
        [0, yellow, 0, 0],
        [0, 0, 0, 0]
    ]
}

// Case 8
function areas_case8(circle1: Circle, circle2: Circle, circle3: Circle): number[][] {
  // Find intersections of each circle pair
  const intersections_1and2 = getIntersection2Circles(circle1, circle2);
  const intersections_1and3 = getIntersection2Circles(circle1, circle3);
  const intersections_2and3 = getIntersection2Circles(circle2, circle3);

  // Find the vertices of the red polygon
  let polygon_vertex_a: Point, polygon_vertex_b: Point, polygon_vertex_c: Point;

  if (pointInCircle(intersections_1and2[0], circle3) === 0) {
    polygon_vertex_a = intersections_1and2[1];
  } else if (pointInCircle(intersections_1and2[1], circle3) === 0) {
    polygon_vertex_a = intersections_1and2[0];
  }

  if (pointInCircle(intersections_1and3[0], circle2) === 0) {
    polygon_vertex_b = intersections_1and3[1];
  } else if (pointInCircle(intersections_1and3[1], circle2) === 0) {
    polygon_vertex_b = intersections_1and3[0];
  }

  if (pointInCircle(intersections_2and3[0], circle1) === 0) {
    polygon_vertex_c = intersections_2and3[1];
  } else if (pointInCircle(intersections_2and3[1], circle1) === 0) {
    polygon_vertex_c = intersections_2and3[0];
  }

  // Find area of polygon using sine rule -> cosine rule
  const polygon_side_a = euclideanDistance(polygon_vertex_a, polygon_vertex_b);
  const polygon_side_b = euclideanDistance(polygon_vertex_a, polygon_vertex_c);
  const polygon_side_c = euclideanDistance(polygon_vertex_b, polygon_vertex_c);

  const angle = Math.acos((polygon_side_b**2 + polygon_side_c**2 - polygon_side_a**2) / (2*polygon_side_b*polygon_side_c));

  const polygon_area = 0.5 * polygon_side_b * polygon_side_c * Math.sin(angle);

  // Find area of each segment:
  // Segment of circle 1: polygon_vertices b & a | radii: polygon_side b & c | opposite chord: polygon_side_a
  // Segment of circle 2: polygon_vertices c & a | radii: polygon_side c & a | opposite chord: polygon_side_b
  // Segment of circle 3: polygon_vertices c & b | radii: polygon_side a & b | opposite chord: polygon_side_c
  const angle1 = Math.acos((circle1.r**2 + circle1.r**2 - polygon_side_a**2) / (2*(circle1.r**2)));
  const area_sector1 = (angle1/(2*Math.PI)) * Math.PI * (circle1.r**2);
  const area_triangle1 = 0.5 * (circle1.r**2) * Math.sin(angle1);
  const area_segment1 = area_sector1 - area_triangle1;

  const angle2 = Math.acos((circle2.r**2 + circle2.r**2 - polygon_side_b**2) / (2*(circle2.r**2)));
  const area_sector2 = (angle2/(2*Math.PI)) * Math.PI * (circle2.r**2);
  const area_triangle2 = 0.5 * (circle2.r**2) * Math.sin(angle2);
  const area_segment2 = area_sector2 - area_triangle2; 

  const angle3 = Math.acos((circle3.r**2 + circle3.r**2 - polygon_side_b**2) / (2*(circle3.r**2)));
  const area_sector3 = (angle3/(2*Math.PI)) * Math.PI * (circle3.r**2);
  const area_triangle3 = 0.5 * (circle3.r**2) * Math.sin(angle3);
  const area_segment3 = area_sector3 - area_triangle3; 

  const red = polygon_area + area_segment1 + area_segment2 + area_segment3;

  const i1and2 = area_overlap_2circles(circle1, circle2);
  const i1and3 = area_overlap_2circles(circle1, circle3);
  const i2and3 = area_overlap_2circles(circle2, circle3);

  const a1 = area_circle(circle1);
  const a2 = area_circle(circle2);
  const a3 = area_circle(circle3);

  const yellow1 = i1and2 - red;
  const yellow2 = i2and3 - red;
  const yellow3 = i1and3 - red;

  const green1 = a1 - (yellow1 + yellow3 + red);
  const green2 = a2 - (yellow1 + yellow2 + red);
  const green3 = a3 - (yellow2 + yellow3 + red);

  return [
    [green1, green2, green3, 0],
    [yellow1, yellow2, yellow3, 0],
    [red, 0, 0, 0]
  ]

}
// Case 9 
function areas_case9(circle1: Circle, circle2: Circle, circle3: Circle): number[][]{
    const y1: number = area_overlap_2circles(circle1, circle2);
    const y2: number = area_overlap_2circles(circle2, circle3);
    const y3: number = area_overlap_2circles(circle1, circle3);

    const a1: number = area_circle(circle1) - y1 - y3;
    const a2: number = area_circle(circle2) - y1 - y2;
    const a3: number = area_circle(circle3) - y2 - y3;

    return [
        [a1, a2, a3, 0],
        [y1, y2, y3, 0],
        [0, 0, 0, 0]
    ]
}

// Case 10
function areas_case10(circle1: Circle, circle2: Circle, circle3: Circle){
    const y1: number = area_circle(circle1);
    const y2: number = area_overlap_2circles(circle2, circle3);

    const g1: number = area_circle(circle2) - y1 - y2;
    const g2: number = area_circle(circle3) - y2;

    return [
        [0, g1, g2, 0],
        [y1, y2, 0, 0],
        [0, 0, 0, 0]
    ]
}

// Case 11
function areas_case11(circle1: Circle, circle2: Circle, circle3: Circle){
    const a1: number = area_circle(circle1);
    const a2: number = area_circle(circle2);
    const a3: number = area_circle(circle3);

    const i1and3: number = area_overlap_2circles(circle1, circle3);
    const i2and3: number = area_overlap_2circles(circle2, circle3);

    const red: number = i1and3;

    const y1: number = a1 - red;
    const y2: number = i2and3 -red;

    const g1: number = a2 - (y1 + y2 + red);
    const g2: number = a3 - (y2 + red);

    return [
        [0, g1, g2 , 0],
        [y1, y2, 0, 0],
        [red, 0, 0, 0]
    ]
}

// Case 12
function areas_case12(circle1: Circle, circle2: Circle, circle3: Circle){
    const red:number = area_circle(circle1);
    let yellow: number = area_overlap_2circles(circle2, circle3);

    const green1: number = area_circle(circle2) - yellow;
    const green2: number = area_circle(circle3) - yellow;

    yellow -= red;

    return [
        [0, green1, green2, 0],
        [0, yellow, 0, 0],
        [red, 0, 0, 0]
    ]
}

function areas_case13(circle1: Circle, circle2: Circle, circle3: Circle): number[][] {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);

    const i1and2 = area_overlap_2circles(circle1, circle2);
    const i1and3 = area_overlap_2circles(circle1, circle3);
    const i2and3 = area_overlap_2circles(circle2, circle3);

    const left = a1 - i1and3; //y4
    const right = a1 - i1and2; //y2

    const intersections_2and3 = getIntersection2Circles(circle2, circle3);
    const intersections_1and2 = getIntersection2Circles(circle1, circle2);
    const intersections_1and3 = getIntersection2Circles(circle1, circle3);

    //---------------
    //Find red using the same approach to find Red in Case 8 (polygon + 4 subtensions)
    //Setting up the red polygon vertices to be:
    //a  #b
    //c  #d

    let polygon_red_vertex_a: Point, polygon_red_vertex_b: Point,
        polygon_red_vertex_c: Point, polygon_red_vertex_d: Point;

    if (intersections_1and3[0].y > intersections_1and3[1].y) {
        polygon_red_vertex_a = intersections_1and3[0];
        polygon_red_vertex_c = intersections_1and3[1];
    } else {
        polygon_red_vertex_a = intersections_1and3[1];
        polygon_red_vertex_c = intersections_1and3[0];
    }

    if (intersections_1and2[0].y > intersections_1and2[1].y) {
        polygon_red_vertex_b = intersections_1and2[0];
        polygon_red_vertex_d = intersections_1and2[1];
    } else {
        polygon_red_vertex_b = intersections_1and2[1];
        polygon_red_vertex_d = intersections_1and2[0];
    }

    //Find the area of the quadrilateral by splitting into 2 triangles: CAB and BDC
    const polygon_red_side_ab = euclideanDistance(polygon_red_vertex_a, polygon_red_vertex_b);
    const polygon_red_side_bd = euclideanDistance(polygon_red_vertex_b, polygon_red_vertex_d);
    const polygon_red_side_cd = euclideanDistance(polygon_red_vertex_c, polygon_red_vertex_d);
    const polygon_red_side_ac = euclideanDistance(polygon_red_vertex_a, polygon_red_vertex_c);
    const polygon_red_side_bc = euclideanDistance(polygon_red_vertex_b, polygon_red_vertex_c);

    const angle_CAB = Math.acos((polygon_red_side_ac ** 2 + polygon_red_side_ab ** 2 - polygon_red_side_bc ** 2) / (2 * polygon_red_side_ac * polygon_red_side_ab));
    const angle_BDC = Math.acos((polygon_red_side_bd ** 2 + polygon_red_side_cd ** 2 - polygon_red_side_bc ** 2) / (2 * polygon_red_side_bd * polygon_red_side_cd));

    const area_triangle_CAB = 0.5 * polygon_red_side_ac * polygon_red_side_ab * Math.sin(angle_CAB);
    const area_triangle_BDC = 0.5 * polygon_red_side_bd * polygon_red_side_bc * Math.sin(angle_BDC);

    const area_red_polygon = area_triangle_CAB + area_triangle_BDC;

    // Find areas of segments of circle 1, subtended from chords ab and cd:
    let angle_a_c1_b = Math.acos((2 * circle1.r ** 2 - polygon_red_side_ab ** 2) / (2 * circle1.r ** 2));
    let angle_c_c1_d = Math.acos((2 * circle1.r ** 2 - polygon_red_side_cd ** 2) / (2 * circle1.r ** 2));

    let area_segment_ab = 0.5 * circle1.r ** 2 * (angle_a_c1_b - Math.sin(angle_a_c1_b));
    let area_segment_cd = 0.5 * circle1.r ** 2 * (angle_c_c1_d - Math.sin(angle_c_c1_d));

    // Find area of segment of circle 2, subtended from chord bd:
    let angle_b_c2_d = Math.acos((2 * circle2.r ** 2 - polygon_red_side_bd ** 2) / (2 * circle2.r ** 2));
    let area_segment_bd = 0.5 * circle2.r ** 2 * (angle_b_c2_d - Math.sin(angle_b_c2_d));

    // Find area of segment of circle 3, subtended from chord ac:
    let angle_a_c3_c = Math.acos((2 * circle3.r ** 2 - polygon_red_side_ac ** 2) / (2 * circle3.r ** 2));
    let area_segment_ac = 0.5 * circle3.r ** 2 * (angle_a_c3_c - Math.sin(angle_a_c3_c));

    let red = area_red_polygon + area_segment_ab + area_segment_cd + area_segment_bd + area_segment_ac;

    // Finding y1 (:= top) and y3 (:= bottom) using the same approach to find Red in Case 8 (polygon + 3 subtensions)

    // "Top" Reuleaux triangle:
    let polygon_top_vertex_a = intersections_2and3[0];
    let polygon_top_vertex_b: Point;
    let polygon_top_vertex_c: Point;

    if (euclideanDistance(intersections_1and3[0], polygon_top_vertex_a) < euclideanDistance(intersections_1and3[1], polygon_top_vertex_a)) {
    polygon_top_vertex_b = intersections_1and3[0];
    } else {
    polygon_top_vertex_b = intersections_1and3[1];
    }

    if (euclideanDistance(intersections_1and2[0], polygon_top_vertex_a) < euclideanDistance(intersections_1and2[1], polygon_top_vertex_a)) {
    polygon_top_vertex_c = intersections_1and2[0];
    } else {
    polygon_top_vertex_c = intersections_1and2[1];
    }

    let polygon_top_side_ab = euclideanDistance(polygon_top_vertex_a, polygon_top_vertex_b);
    let polygon_top_side_ac = euclideanDistance(polygon_top_vertex_a, polygon_top_vertex_c);
    let polygon_top_side_bc = euclideanDistance(polygon_top_vertex_b, polygon_top_vertex_c);

    let polygon_top_angle = Math.acos((polygon_top_side_ab ** 2 + polygon_top_side_ac ** 2 - polygon_top_side_bc ** 2) / (2 * polygon_top_side_ab * polygon_top_side_ac));

    let polygon_top_area = 0.5 * polygon_top_side_ab * polygon_top_side_ac * Math.sin(polygon_top_angle);

    // "Top" segments:
    let segment_angle_top_circle1 = Math.acos((2 * circle1.r ** 2 - polygon_top_side_bc ** 2) / (2 * circle1.r ** 2));
    const segment_angle_top_circle2 = Math.acos((2 * circle2.r ** 2 - polygon_top_side_ac ** 2) / (2 * circle2.r ** 2));
    const segment_angle_top_circle3 = Math.acos((2 * circle3.r ** 2 - polygon_top_side_ab ** 2) / (2 * circle3.r ** 2));
    
    const segment_area_top_circle1 = 0.5 * circle1.r ** 2 * (segment_angle_top_circle1 - Math.sin(segment_angle_top_circle1));
    const segment_area_top_circle2 = 0.5 * circle2.r ** 2 * (segment_angle_top_circle2 - Math.sin(segment_angle_top_circle2));
    const segment_area_top_circle3 = 0.5 * circle3.r ** 2 * (segment_angle_top_circle3 - Math.sin(segment_angle_top_circle3));
    
    const top = polygon_top_area - segment_area_top_circle1 + segment_area_top_circle2 + segment_area_top_circle3;
    
    //----
    
    //"Bottom" Reuleaux triangle:
    
    const polygon_bottom_vertex_a = intersections_2and3[1];
    
    let polygon_bottom_vertex_b: Point;
    let polygon_bottom_vertex_c: Point;
    
    if (euclideanDistance(intersections_1and3[0], polygon_bottom_vertex_a) < euclideanDistance(intersections_1and3[1], polygon_bottom_vertex_a)) {
      polygon_bottom_vertex_b = intersections_1and3[0];
    } else {
      polygon_bottom_vertex_b = intersections_1and3[1];
    }
    
    if (euclideanDistance(intersections_1and2[0], polygon_bottom_vertex_a) < euclideanDistance(intersections_1and2[1], polygon_bottom_vertex_a)) {
      polygon_bottom_vertex_c = intersections_1and2[0];
    } else {
      polygon_bottom_vertex_c = intersections_1and2[1];
    }
    
    const polygon_bottom_side_ab = euclideanDistance(polygon_bottom_vertex_a, polygon_bottom_vertex_b);
    const polygon_bottom_side_ac = euclideanDistance(polygon_bottom_vertex_a, polygon_bottom_vertex_c);
    const polygon_bottom_side_bc = euclideanDistance(polygon_bottom_vertex_b, polygon_bottom_vertex_c);
    
    const polygon_bottom_angle = Math.acos((polygon_bottom_side_ab ** 2 + polygon_bottom_side_ac ** 2 - polygon_bottom_side_bc ** 2) / (2 * polygon_bottom_side_ab * polygon_bottom_side_ac));
    
    const polygon_bottom_area = 0.5 * polygon_bottom_side_ab * polygon_bottom_side_ac * Math.sin(polygon_bottom_angle);
    
    //"Bottom" segments:
    
    const segment_angle_bottom_circle1 = Math.acos((2 * circle1.r ** 2 - polygon_bottom_side_bc ** 2) / (2 * circle1.r ** 2));
    const segment_angle_bottom_circle2 = Math.acos((2 * circle2.r ** 2 - polygon_bottom_side_ac ** 2) / (2 * circle2.r ** 2));
    const segment_angle_bottom_circle3 = Math.acos((2 * circle3.r ** 2 - polygon_bottom_side_ab ** 2) / (2 * circle3.r ** 2));
    
    const segment_area_bottom_circle1 = 0.5 * circle1.r ** 2 * (segment_angle_bottom_circle1 - Math.sin(segment_angle_bottom_circle1));
    const segment_area_bottom_circle2 = 0.5 * circle2.r ** 2 * (segment_angle_bottom_circle2 - Math.sin(segment_angle_bottom_circle2));
    const segment_area_bottom_circle3 = 0.5 * circle3.r ** 2 * (segment_angle_bottom_circle3 - Math.sin(segment_angle_bottom_circle3));
    
    const bottom = polygon_bottom_area - segment_area_bottom_circle1 + segment_area_bottom_circle2 + segment_area_bottom_circle3;

    //----------


    const green1 = a2 - i2and3 - left;
    const green2 = a3 - i2and3 - right;

    return [
        [0, green1, green2, 0],
        [left, top, right, bottom],
        [red, 0, 0, 0]
    ]
}

// Case14
function areas_case14(circle1: Circle, circle2: Circle, circle3: Circle) {
    const a1 = area_circle(circle1);
    const a2 = area_circle(circle2);
    const a3 = area_circle(circle3);
    
    const i1and2 = area_overlap_2circles(circle1, circle2);
    const i1and3 = area_overlap_2circles(circle1, circle3);
    const i2and3 = area_overlap_2circles(circle2, circle3);

    const red = i1and3;

    const y1 = i1and2 - red;
    const y2 = i2and3 - red;

    const green1 = a1 - i1and2;
    const green4 = a3 - i2and3;

    const intersections_1and2 = getIntersection2Circles(circle1, circle2);
    const intersections_1and3 = getIntersection2Circles(circle1, circle3);  
    const intersections_2and3 = getIntersection2Circles(circle2, circle3);

    // Finding g2 (:=top) and g3 (:= bottom) areas using polygon + segments---------------------------------------------

    let polygon_top_vertex_c :Point;
    let polygon_bottom_vertex_c: Point;
    let polygon_top_vertex_a: Point;
    let polygon_bottom_vertex_a: Point;
    let polygon_top_vertex_b: Point;
    let polygon_bottom_vertex_b: Point;

    if (intersections_1and3[0].y > intersections_1and3[1].y) {
        polygon_top_vertex_c = intersections_1and3[0];
        polygon_bottom_vertex_c = intersections_1and3[1];
    } else {
        polygon_top_vertex_c = intersections_1and3[1];
        polygon_bottom_vertex_c = intersections_1and3[0];
    }

    if (intersections_1and2[0].y > intersections_1and2[1].y) {
        polygon_top_vertex_a = intersections_1and2[0];
        polygon_bottom_vertex_a = intersections_1and2[1];
    } else {
        polygon_top_vertex_a = intersections_1and2[1];
        polygon_bottom_vertex_a = intersections_1and2[0];
    }

    if (intersections_2and3[0].y > intersections_2and3[1].y) {
        polygon_top_vertex_b = intersections_2and3[0];
        polygon_bottom_vertex_b = intersections_2and3[1];
    } else {
        polygon_top_vertex_b = intersections_2and3[1];
        polygon_bottom_vertex_b = intersections_2and3[0];
    }

    const polygon_top_side_ab = euclideanDistance(polygon_top_vertex_a, polygon_top_vertex_b);
    const polygon_top_side_ac = euclideanDistance(polygon_top_vertex_a, polygon_top_vertex_c);
    const polygon_top_side_bc = euclideanDistance(polygon_top_vertex_b, polygon_top_vertex_c);

    const polygon_bottom_side_ab = euclideanDistance(polygon_bottom_vertex_a, polygon_bottom_vertex_b);
    const polygon_bottom_side_ac = euclideanDistance(polygon_bottom_vertex_a, polygon_bottom_vertex_c);
    const polygon_bottom_side_bc = euclideanDistance(polygon_bottom_vertex_b, polygon_bottom_vertex_c);

    //TOP======================================================================
    const polygon_top_angle = Math.acos((polygon_top_side_ac ** 2 + polygon_top_side_bc ** 2 - polygon_top_side_ab ** 2) / (2 * polygon_top_side_ac * polygon_top_side_bc)); //angle ACB
    const polygon_top_area = 0.5 * polygon_top_side_ac * polygon_top_side_bc * Math.sin(polygon_top_angle);

    const top_angle_a_c1_c = Math.acos((2 * circle1.r ** 2 - polygon_top_side_ac ** 2) / (2 * circle1.r ** 2));
    const top_segment_1 = 0.5 * circle1.r ** 2 * (top_angle_a_c1_c - Math.sin(top_angle_a_c1_c));

    const top_angle_a_c2_b = Math.acos((2 * circle2.r ** 2 - polygon_top_side_ab ** 2) / (2 * circle2.r ** 2));
    const top_segment_2 = 0.5 * circle2.r ** 2 * (top_angle_a_c2_b - Math.sin(top_angle_a_c2_b));

    const top_angle_c_c2_b = Math.acos((2 * circle3.r ** 2 - polygon_top_side_bc ** 2) / (2 * circle3.r ** 2));
    const top_segment_3 = 0.5 * circle3.r ** 2 * (top_angle_c_c2_b - Math.sin(top_angle_c_c2_b));

    const green2 = polygon_top_area - top_segment_1 + top_segment_2 - top_segment_3;

    //BOTTOM======================================================================
    const polygon_bottom_angle = Math.acos((polygon_bottom_side_ac ** 2 + polygon_bottom_side_bc ** 2 - polygon_bottom_side_ab ** 2) / (2 * polygon_bottom_side_ac * polygon_bottom_side_bc)); //angle ACB
    const polygon_bottom_area = 0.5 * polygon_bottom_side_ac * polygon_bottom_side_bc * Math.sin(polygon_bottom_angle);

    const bottom_angle_a_c1_c = Math.acos((2 * circle1.r ** 2 - polygon_bottom_side_ac ** 2) / (2 * circle1.r ** 2));
    const bottom_segment_1 = 0.5 * circle1.r ** 2 * (bottom_angle_a_c1_c - Math.sin(bottom_angle_a_c1_c));

    const bottom_angle_a_c2_b = Math.acos((2 * circle2.r ** 2 - polygon_bottom_side_ab ** 2) / (2 * circle2.r ** 2));
    const bottom_segment_2 = 0.5 * circle2.r ** 2 * (bottom_angle_a_c2_b - Math.sin(bottom_angle_a_c2_b));

    const bottom_angle_c_c2_b = Math.acos((2 * circle3.r ** 2 - polygon_bottom_side_bc ** 2) / (2 * circle3.r ** 2));
    const bottom_segment_3 = 0.5 * circle3.r ** 2 * (bottom_angle_c_c2_b - Math.sin(bottom_angle_c_c2_b));

    const green3 = polygon_bottom_area - bottom_segment_1 + bottom_segment_2 - bottom_segment_3;

    return [
        [green1, green2, green4, green3],
        [y1, y2, 0, 0],
        [red, 0, 0, 0]
    ]
}

function findColouredAreas([circle1, circle2, circle3]: Circle[]): number[][] {
    const Case: [number, number] = determineOverlapCase(circle1, circle2, circle3);

    let circle1_: Circle;
    let circle2_: Circle;
    let circle3_: Circle;
  
    const circle_config: number = Case[1];
  
    if (circle_config === 1) {
      circle1_ = circle1;
      circle2_ = circle2;
      circle3_ = circle3;
    } else if (circle_config === 2) {
      circle1_ = circle1; 
      circle2_ = circle3;
      circle3_ = circle2;
    } else if (circle_config === 3) {
      circle1_ = circle2;
      circle2_ = circle1;
      circle3_ = circle3;
    } else if (circle_config === 4) {
      circle1_ = circle3;
      circle2_ = circle1;
      circle3_ = circle2;
    } else if (circle_config === 5) {
      circle1_ = circle2;
      circle2_ = circle3;
      circle3_ = circle1;
    } else if (circle_config === 6) {
      circle1_ = circle3;
      circle2_ = circle2;
      circle3_ = circle1;
    }
  
    let coloured_areas: number[][];

    if (Case[0] === 1) {
        coloured_areas = areas_case1(circle1_, circle2_, circle3_);
    } else if (Case[0] === 2) {
        coloured_areas = areas_case2(circle1_, circle2_, circle3_);
    } else if (Case[0] === 3) {
        coloured_areas = areas_case3(circle1_, circle2_, circle3_);
    } else if (Case[0] === 4) {
        coloured_areas = areas_case4(circle1_, circle2_, circle3_);
    } else if (Case[0] === 5) {
        coloured_areas = areas_case5(circle1_, circle2_, circle3_);
    } else if (Case[0] === 6) {
        coloured_areas = areas_case6(circle1_, circle2_, circle3_);
    } else if (Case[0] === 7) {
        coloured_areas = areas_case7(circle1_, circle2_, circle3_);
    } else if (Case[0] === 8) {
        coloured_areas = areas_case8(circle1_, circle2_, circle3_);
    } else if (Case[0] === 9) {
        coloured_areas = areas_case9(circle1_, circle2_, circle3_);
    } else if (Case[0] === 10) {
        coloured_areas = areas_case10(circle1_, circle2_, circle3_);
    } else if (Case[0] === 11) {
        coloured_areas = areas_case11(circle1_, circle2_, circle3_);
    } else if (Case[0] === 12) {
        coloured_areas = areas_case12(circle1_, circle2_, circle3_);
    } else if (Case[0] === 13) {
        coloured_areas = areas_case13(circle1_, circle2_, circle3_);
    } else if (Case[0] === 14) {
        coloured_areas = areas_case14(circle1_, circle2_, circle3_);
    }
    else{
        coloured_areas = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    }
      
    //   console.log("Green: ", coloured_areas[0]);
    //   console.log("Yellow: ", coloured_areas[1]);
    //   console.log("Red: ", coloured_areas[2]);
    
    return coloured_areas;
}

export { findColouredAreas };

/* Probability Function */

function probGreen(areaGreen: number): number {
    if (areaGreen === 0) {
      return 0;
    } else {
        const k = 799158.3166;
        let P = k / areaGreen / 100000;
  
    if (P > 0.99) {
        return 0.99;
    }
    if (P <= 0){
        return 0;
    }
    
    return P;
    }
}
  
function probYellow(areaYellow: number): number {
    if (areaYellow === 0) {
        return 0;
    } else {
        const k = 207299;
        let P = k / areaYellow / 100000;
  
    if (P > 0.99) {
        P = 0.99;
    }
    if(P <= 0){
        return 0;
    }
  
    return P;
    }
}
  
function probRed(areaRed: number): number {
    if (areaRed === 0) {
        return 0;
    } else {
        const k = 2183363;
        let P = k / areaRed / 100000;
  
    if (P > 0.99) {
        P = 0.99;
    }
    if(P <= 0){
        return 0;
    }
  
    return P;
    }
}

function findProbabilities(areasVector: number[][]): number[][] {
    for (let i = 0; i < areasVector[0].length; i++) {
        areasVector[0][i] = probGreen(areasVector[0][i]);
    }
    for (let i = 0; i < areasVector[1].length; i++) {
        areasVector[1][i] = probYellow(areasVector[1][i]);
    }
    for (let i = 0; i < areasVector[2].length; i++) {
        areasVector[2][i] = probRed(areasVector[2][i]);
    }
    return areasVector;
}

export {findProbabilities};