function Isosurfaces( volume, isovalue )
{
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial();

    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;
    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {                      //volume.resolution.z - 1
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {                  //volume.resolution.y - 1
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {              //volume.resolution.x - 1
                //console.log("cell_index");
                //console.log(cell_index);
                var indices = cell_node_indices( cell_index++ );
                var index = table_index( indices );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j+1];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];
                    
                    /*console.log("vid_number");
                    console.log(vid0);
                    console.log(vid1);
                    console.log(vid2);
                    console.log(vid3);
                    console.log(vid4);
                    console.log(vid5);  */ 

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );
                    
                    //v0~v5のscala　を求めるための配列番号

                    var lines = volume.resolution.x;
                    var slices = volume.resolution.x * volume.resolution.y;


                    var v0id = cell_index+ vid0[0]+vid0[1]*slices+vid0[2]*lines
                    var v1id = cell_index+ vid1[0]+vid1[1]*slices+vid1[2]*lines
                    var v2id = cell_index+ vid2[0]+vid2[1]*slices+vid2[2]*lines
                    var v3id = cell_index+ vid3[0]+vid3[1]*slices+vid3[2]*lines
                    var v4id = cell_index+ vid4[0]+vid4[1]*slices+vid4[2]*lines
                    var v5id = cell_index+ vid5[0]+vid5[1]*slices+vid5[2]*lines

                  /*  console.log("index_number_I_made")
                    console.log(v0id);
                    console.log(v1id);
                    console.log(v2id);
                    console.log(v3id);
                    console.log(v4id);
                    console.log(v5id);   */
                    
                    //Salar値求める

                    var scala0 = volume.values[ v0id][0];
                    var scala1 = volume.values[ v1id ][0];
                    var scala2 = volume.values[ v2id ][0];
                    var scala3 = volume.values[ v3id ][0];
                    var scala4 = volume.values[ v4id ][0];
                    var scala5 = volume.values[ v5id ][0];

                 /*  console.log("sucara2");
                   console.log(scala0);
                    console.log(scala1);
                   console.log(scala2);
                    console.log(scala3);
                    console.log(scala4);
                     console.log(scala5);  */
 







                     var v01 = interpolated_vertex( v0, v1,scala0,scala1, isovalue );
                     var v23 = interpolated_vertex( v2, v3,scala2,scala3, isovalue );
                     var v45 = interpolated_vertex( v4, v5,scala4,scala5, isovalue );
 
                   

                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;
                    geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();

    material.color = new THREE.Color( "white" );

    return new THREE.Mesh( geometry, material );


    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;

        /*console.log("index_number_teacher_made")
                    console.log(id0);
                    console.log(id1);
                    console.log(id2);
                    console.log(id3);
                    console.log(id4);
                    console.log(id5);
                                          */
        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];
        





        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }

        return index;
    }

    function interpolated_vertex( v0, v1,scala0,scala1 ,isovalue )
    {
    //s0→v0のスカラー値　s1→v1のスカラー値

  //  var p = (s-s1)/(s0-s1);　
   // var p = scala1-scala0;
    //var vk = new THREE.Vector3(0,0,0);

   /* vk.x = ((scala0-isovalue)*v1.x+(isovalue-scala1)*v0.x)/(scala0-scala1);
    vk.y = ((scala0-isovalue)*v1.y+(isovalue-scala1)*v0.y)/(scala0-scala1);
    vk.z = ((scala0-isovalue)*v1.z+(isovalue-scala1)*v0.z)/(scala0-scala1);
    
    console.log("internal_division_point_n")
    console.log((scala0-isovalue)/(scala0-scala1));
    console.log("check_scala0")
    console.log(scala0);
    console.log("check_scala1")
    console.log(scala1);
    console.log("check_denominator")
    console.log(scala0-scala1);
    console.log("internal_division_point_m")
    console.log((isovalue-scala1)/(scala0-scala1));
    console.log("answer")
    console.log(vk); */
    /*v0.x = v0.x*(1-p);
    v0.y = v0.y*(1-p);
    v0.z = v0.z*(1-p);

    v1.x = v1.x*p;
    v1.y = v1.y*p;
    v1.z = v1.z*p; *\

      //  console.log(new THREE.Vector3().addVectors( v0, v1 ));



       //console.log(v0);
       //console.log(v1);
       //p = (2*s-s0-s1)/(s1-s0);
      // console.log(p);


       //var vk = new THREE.Vector3(0,0,0);
       //var vp = new THREE.Vector3(0,0,0);
       //vk = v0.sub(v1);
       //var t = (s-s1)/(s0-s1);









        /*console.log("t_price");
        console.log(t);
        console.log("so_price");
        console.log(s0);
        console.log("s1_price");
        console.log(s1);
        console.log("s_price");
        console.log(s); */
        //vp.x = v0.x + (vk.x)*t;
        //vp.y = v0.y + (vk.y)*t;
        //vp.z = v0.z + (vk.z)*t;
       //vp.x = (1/2)*(v0.x+v1.x)+(1/2)*(v1.x-v0.x)*p
       //vp.y = (1/2)*(v0.y+v1.y)+(1/2)*(v1.y-v0.y)*p
       //vp.z = (1/2)*(v0.z+v1.z)+(1/2)*(v1.z-v0.z)*p
       //console.log(vk);

      // console.log(vp);

       
    /*  if(scala0 - scala1==0){ 
          vk.x = (1/2)*v0.x + (1/2)*v1.x;
          vk.y = (1/2)*v0.y + (1/2)*v1.y;
          vk.z = (1/2)*v0.z + (1/2)*v1.z;
        //return new THREE.Vector3().addVectors( v0, v1 ).divideScalar( 2 );
      }else{
       
        vk.x = ((scala0-isovalue)*v1.x+(isovalue-scala1)*v0.x)/(scala0-scala1);
        vk.y = ((scala0-isovalue)*v1.y+(isovalue-scala1)*v0.y)/(scala0-scala1);
        vk.z = ((scala0-isovalue)*v1.z+(isovalue-scala1)*v0.z)/(scala0-scala1);
        console.log("answer")
        console.log(vk);
      }
              */

         console.log("real_answer");
         console.log(new THREE.Vector3().addVectors( v0, v1 ).divideScalar( 2 ));
         //console.log("answer")
         //console.log(vk);
      //   return vk;






         var id0 = index_of( v0.x, v0.y, v0.z );
         var id1 = index_of( v1.x, v1.y, v1.z );

         //var s0 = object.values[id0];
         //var s1 = object.values[id1];

         var a = ( isovalue - scala0 ) / ( scala1 - scala0 );
         var x = KVS.Mix( v0.x, v1.x, a );
         var y = KVS.Mix( v0.y, v1.y, a );
         var z = KVS.Mix( v0.z, v1.z, a );
         console.log(x);
         console.log(y);
         console.log(z);

         var vk = new THREE.Vector3(0,0,0);
         vk.x = x;
         vk.y = y;
         vk.z = z;

         return vk;

























        
    }




    function index_of( x, y, z )
    {
       // var nlines = object.numberOfNodesPerLine();
       // var nslices = object.numberOfNodesPerSlice();

       var nlines = volume.resolution.x;
       var nslices = volume.resolution.x * volume.resolution.y;

        return x + y * nlines + z * nslices;
    }






}
