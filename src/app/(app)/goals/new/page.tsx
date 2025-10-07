import { GoalForm } from "@/components/goal-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewGoalPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Crear Nueva Meta</h1>
                <p className="text-muted-foreground">Define tu próximo objetivo siguiendo la metodología SMARTER.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Formulario de Meta</CardTitle>
                    <CardDescription>Completa todos los campos para crear una meta clara y alcanzable.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GoalForm />
                </CardContent>
            </Card>
        </div>
    );
}
