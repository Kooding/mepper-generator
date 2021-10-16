const namespaceEl = document.querySelector('#namespace');
const valueObjectEl = document.querySelector('#value-object');
const textArea = document.querySelector('#taxt-area');
const whereTextArea = document.querySelector('#where');
const output = document.querySelector('#output');
const genBtn = document.querySelector('#gen-btn');

namespaceEl.value = 'T_TABLE_NAME'
valueObjectEl.value = "testVO"
textArea.value = `linkDgr
ndbOjogCd
statDivCd
pblLstCd
linkTranId
sendRslt
sendDt
rcvDt
vrf1Yn
vrf1YnRcvDt
vrf1ErrDesc
vrf2Yn
vrf2YnRcvDt
vrf2ErrDesc
tblCd
regDt
useYn`
whereTextArea.value = `linkDgr
ndbOjogCd
statDivCd
pblLstCd
linkTranId`

genBtn.addEventListener('click', () =>{
    const nameSpace = namespaceEl.value;
    const valueObject = valueObjectEl.value;
    const textString = textArea.value;
    const whereString = whereTextArea.value;
    const array = textString.split('\n');
    const whereArray = whereString.split('\n');

    let upper = uppercaseTranslate(array);
    const outputStringUpper = generator2(array)
    const outputString = generator(upper);
    console.log('[output] - ', output);
    const whereUpper = uppercaseTranslate(whereArray);

    //set
    const setOutput = generator3(upper, array);

    // where
    const whereOutput = generator4(whereArray, whereUpper);
    
    outputProcessing(nameSpace, valueObject, outputString,  outputStringUpper, setOutput, whereOutput);

})

function uppercaseTranslate(array2) {
    let transWord = [];
    let myUppercase = array2.map((v, i) => {
        let word = '';
        // 단어를 하나하나 쪼갠다.
        v.split('')
        .forEach(e => {
            if (e === e.toUpperCase()) {
                if(!isNaN(e)) {
                    word += `${e}`
                    return
                }
                word += `_${e}`;
            } else 
                word += e.toUpperCase();
        })
        transWord.push(word);
    })
  
    return transWord;
}

function generator(array) {
    let tempString = '';
    array.forEach((e, index) => {
        if(index == 0) {
            tempString += `	${e}\n`
        } else {
            tempString += `			, ${e}\n`
        }
    });

    return tempString;
}

function generator2(array) {
    let tempString = '';
    array.forEach((e, index) => {
        if(index == 0) {
            tempString += `	#{${e}}\n`
        } else {
            tempString += `			, #{${e}}\n`
        }
    });

    return tempString;
}

function generator3(upper, array) {
    let tempString = '';
    upper.forEach((v, i) => {
        if(i === 0)
            tempString += `	${v} = #{${array[i]}}\n`
        else 
            tempString += `			, ${v} = #{${array[i]}}\n`
    })
    return tempString;
}

function generator4(whereArray, whereUpper) {
    let tempString = '';
    whereUpper.forEach((v, i) => {
        if(i === 0)
            tempString += `	${v} = #{${whereArray[i]}}\n`
        else 
            tempString += `			AND ${v} = #{${whereArray[i]}}\n`

    })
    return tempString;
}
function outputProcessing(namespace, valueObject, column, values, setOutput, whereOutput) {
    let template = 
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="${namespace}">

	<select id="getTotalCount" parameterType="${valueObject}" resultType="long" >
		SELECT    COUNT(*) AS TOTALCOUT
		FROM  ${namespace}
		<where>

		</where>
	</select>   
    
	<select id="getList" parameterType="${valueObject}" resultType="HashMap" >
		SELECT    *
		FROM  ${namespace}
		<where>

		</where>
	</select>
    
	<select id="getRecord" parameterType="${valueObject}" resultType="HashMap" >
		SELECT    *
		FROM  ${namespace}
		<where>
			${whereOutput}
		</where>
	</select>   

	<insert id="setInsert" parameterType="${valueObject}">
		INSERT INTO  ${namespace}
		(
			${column}
		)
		VALUES
		(
			${values}
		)
	</insert>         
    
	<update id="setUpdate" parameterType="${valueObject}">
		UPDATE  ${namespace}
		SET
			${setOutput}
		<where>
			${whereOutput}
		</where>

	</update>
    
	<delete id="setDelete" parameterType="${valueObject}">
		DELETE FROM  ${namespace}
		<where>
			${whereOutput}
		</where>
	</delete>   

</mapper>`;

    output.value = template
}