import { NextResponse} from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST (request: Request)  {
    try {
        const body = await request.json()



        const { name, business_name, whatsapp, email, answers, notes} = body

        if(!name || !business_name || !whatsapp || !email || !answers ) {
            return NextResponse.json(
                {error: "Missing required fields"},
                {status: 400}
            )
        }

        const {data, error} = await supabase.from("applications").insert([{
            name, 
            business_name, 
            whatsapp,
            email,
            answers,
            notes: notes || null
            
        }])
        .select()
        .single()

        if(error){
            console.error("error de supabase", error)
            return NextResponse.json(
                {error: "No se pudo guardar la aplicacion"},
                {status: 500}
            )
        }



        // PARTE PARA IMPLEMENTAR IA Y QUE VALIDE LAS RESPUESTAS Y DE UN ESTADO

        const aiResponse = await fetch("https://ai-brain-six.vercel.app/api/evaluate-application", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({answers})
        })

        const aiResult = await aiResponse.json()

        if(aiResult.success && aiResult.evaluation){

            const evaluation = aiResult.evaluation


            await supabase 
            .from("applications")
            .update({
                status: evaluation.decision === "Aprobado" ? "approved" : "refused",
                ai_reason: evaluation.justificacion_decision,
                ai_summary: evaluation.resumen_ejecutivo,
                ai_fit: evaluation.nivel_de_fit
            })
            .eq("id", data.id)
        }



        return NextResponse.json(
            { success: true, data },
            { status: 201 }
          );

    } catch (error) {
        console.error("error de la API", error)
        return NextResponse.json(
            {error: "Error interno del servidor"},
            {status: 500}
        )
    }


}
